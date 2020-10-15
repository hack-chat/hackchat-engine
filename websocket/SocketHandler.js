const EventEmitter = require('events');

const browser = typeof window !== 'undefined';
const WebSocket = browser ? window.WebSocket : require('ws');

const { Status, Events, OPCodes } = require('../util/Constants');
const PacketRouter = require('./packets/PacketRouter');

/**
  * Handles websocket events
  * @private
  */
class SocketHandler extends EventEmitter {
  /**
    * @param {SocketController} controller Controller of this handler
    * @param {string} gateway Target gateway address to connect to
    */
  constructor(controller, gateway) {
    super();

    /**
      * Controller of this handler
      * @type {SocketController}
      */
    this.controller = controller;

    /**
      * The client this belongs to
      * @type {Client}
      */
    this.client = controller.client;

    /**
      * The actual WebSocket
      * @type {WebSocket}
      */
    this.ws = null;

    /**
      * Client connection status
      * @type {number}
      */
    this.status = Status.IDLE;

    /**
      * Data routing class for this client
      * @type {PacketRouter}
      */
    this.packetRouter = new PacketRouter(this);

    /**
      * Holds packet queue and tracks ratelimits
      * @type {object}
      */
    this.packetQueue = {
      queue: [],
      remaining: 120,
      total: 120,
      time: 60000,
      resetTimer: null,
    };

    /**
      * Events requested to be ignored by the client
      * @type {object}
      */
    this.ignoredEvents = {};
    this.client.options.ignoredEvents.forEach((event) => {
      this.ignoredEvents[event] = true;
    });

    /**
      * Connection is expecting to be closed
      * @type {boolean}
      */
    this.closeExpected = false;

    /**
      * Current session id
      * @type {string}
      */
    this.sessionID = '';

    /**
      * Store new client session id when assigned
      */
    this.client.on(Events.SESSION, (data) => {
      this.sessionID = data.sessionID;
    });

    // Initiate connection
    this.connect(gateway);
  }

  /**
    * Stores ready status and emits the ready event
    * @returns {void}
    */
  triggerReady() {
    if (this.status === Status.READY) {
      this.debug('Attempted to trigger ready when status was ready');
      return;
    }

    /**
      * Emitted when client is now connected and ready to start
      * @event Client#connected
      */
    this.status = Status.READY;
    this.client.emit(Events.READY);

    this.packetRouter.processQueue();
  }

  /**
    * Emit a debug message
    * @param {string} message Debug string
    * @returns {void}
    */
  debug(message) {
    let debugMsg = message;
    if (message instanceof Error) debugMsg = message.stack;

    return this.controller.debug(`[socket handler] ${debugMsg}`);
  }

  /**
    * Sends awaiting outgoing packets
    */
  pushPackets() {
    if (this.packetQueue.remaining === 0) return;
    if (this.packetQueue.queue.length === 0) return;

    if (this.packetQueue.remaining === this.packetQueue.total) {
      this.packetQueue.resetTimer = this.client.setTimeout(() => {
        this.packetQueue.remaining = this.packetQueue.total;
        this.pushPackets();
      }, this.packetQueue.time);
    }

    while (this.packetQueue.remaining > 0) {
      const item = this.packetQueue.queue.shift();
      if (!item) return;
      this.wsSend(item);
      this.packetQueue.remaining -= 1;
    }
  }

  /**
    * Send data through the websocket
    * @param {object} data Packet to send
    * @returns {void}
    * @private
    */
  wsSend(data) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.debug(`[socket handler] No connection, failed to send: ${data}`);
      return;
    }

    this.ws.send(JSON.stringify(data));
  }

  /**
    * Pushes data on to the outgoing packet queue stack
    * @param {object} data Packet to push
    * @returns {void}
    */
  send(data) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.debug(`[socket handler] No connection, failed to send: ${data}`);
      return;
    }

    this.packetQueue.queue.push(data);
    this.pushPackets();
  }

  /**
    * Initializes the websocket, connecting to the passed gateway
    * @param {string} gateway Target gateway
    * @param {number} [after=0] Wait time before connecting (in ms)
    * @param {boolean} [force=false] Ignore already existing connection
    * @returns {boolean}
    */
  connect(gateway = this.gateway, after = 0, force = false) {
    if (after) {
      this.client.setTimeout(() => {
        this.connect(gateway, 0, force);
      },
      after);

      return false;
    }

    if (this.ws && !force) {
      this.debug('[socket handler] Connection already exists');

      return false;
    } if (typeof gateway !== 'string') {
      this.debug(`[socket handler] Invalid gateway: ${gateway}`);

      return false;
    }

    this.closeExpected = false;
    this.gateway = gateway;
    this.debug(`[socket handler] Connecting to ${gateway}`);

    this.ws = new WebSocket(gateway);

    this.ws.onmessage = this.onMessage.bind(this);
    this.ws.onopen = this.onOpen.bind(this);
    this.ws.onerror = this.onError.bind(this);
    this.ws.onclose = this.onClose.bind(this);

    this.status = Status.CONNECTING;

    return true;
  }

  /**
    * Destroys the connection.
    * @returns {boolean}
    */
  destroy() {
    if (!this.ws) {
      this.debug('[socket handler] Cannot destroy what doesnt exist');
      return false;
    }

    this.closeExpected = true;
    this.ws.close(1000);
    this.packetRouter.processQueue();
    this.ws = null;
    this.status = Status.DISCONNECTED;
    this.packetQueue.remaining = this.packetQueue.total;
    return true;
  }

  /**
    * Websocket onMessage handler
    * @param {Event} event Incoming event
    * @returns {boolean}
    */
  onMessage(event) {
    let data;

    try {
      data = JSON.parse(event.data);
    } catch (err) {
      this.emit('debug', err);
      return false;
    }

    return this.onPacket(data);
  }

  /**
    * Handles incoming packets
    * @param {object} packet Incoming packet
    * @returns {boolean}
    */
  onPacket(packet) {
    if (!packet) {
      this.debug('[socket handler] Server sent empty message');
      return false;
    }

    /**
      * Emitted whenever a packet is received
      * @event Client#raw
      */
    this.client.emit('raw', packet);

    switch (packet.cmd) {
      case Events.RECONNECT:
        // Allow server to reset users connection
        return this.reconnect();
      default:
        return this.packetRouter.route(packet);
    }
  }

  /**
    * Websocket onOpen handler
    */
  onOpen() {
    this.debug(`[socket handler] Connected to gateway ${this.gateway}`);

    /**
       * Emitted when websocket has been connected
       * @event Client#connected
       */
    this.client.emit(Events.CONNECTED, this.client);

    this.sessionStart();
  }

  /**
    * Force attempt to re-establish a connection, with delay
    */
  reconnect() {
    this.debug('[socket handler] Forcing reconnect in 5.5 seconds');

    /**
      * Emitted when the client tries to reconnect
      * @event Client#reconnecting
      */
    this.client.emit(Events.RECONNECTING);

    this.connect(this.gateway, 5500, true);
  }

  /**
    * Websocket onError handler
    * @param {Error} error The error
    */
  onError(error) {
    /**
      * Emitted when the websocket encounters an error
      * @event Client#error
      * @param {Error} error The encountered error
      */
    this.client.emit(Events.ERROR, error);
  }

  /**
    * Websocket onClose handler
    * @param {CloseEvent} event Close event
    */
  onClose(event) {
    this.debug(`[socket handler] Connection lost: ${event.code}`);

    if (event.code === 1000 && this.closeExpected) {
      this.closeExpected = false;

      /**
        * Emitted when the client's WebSocket disconnects and will no longer attempt to reconnect.
        * @event Client#disconnect
        * @param {CloseEvent} event Close event
        */
      this.client.emit(Events.DISCONNECT, event);

      this.destroy();
      return;
    }

    this.closeExpected = false;
    this.reconnect();
  }

  /**
    * Starts or resumes a session with the server
    * @returns {void}
    */
  sessionStart() {
    return this.sessionID ? this.resumeSession() : this.newSession();
  }

  /**
    * Requests a new session from the server
    * @returns {void}
    */
  newSession() {
    this.debug('[socket handler] Identifying as a new session');

    const payload = {
      cmd: OPCodes.SESSION,
      isBot: this.client.options.isBot,
    };

    return this.send(payload);
  }

  /**
    * Attempts to resume a previously established session
    * @returns {void}
    */
  resumeSession() {
    if (!this.sessionID) {
      this.debug('[socket handler] Cannot resume session without session id, starting new. . .');
      return this.newSession();
    }

    this.debug(`[socket handler] Attempting to resume session ${this.sessionID}`);

    const payload = {
      cmd: OPCodes.SESSION,
      isBot: this.client.options.isBot,
      id: this.sessionID,
    };

    return this.send(payload);
  }
}

SocketHandler.WebSocket = WebSocket;

module.exports = SocketHandler;
