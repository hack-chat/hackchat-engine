/* eslint global-require: 0 */
const { Status, WSEvents } = require('../../util/Constants');

const BeforeReadyWhitelist = [
  WSEvents.SESSION,
];

/**
  * Routes packet data to the appropriate handler
  * @private
  */
class PacketRouter {
  /**
    * @param {SocketHandler} connection Web socket reference
    */
  constructor(connection) {
    /**
      * Web socket reference
      * @type {SocketHandler}
      */
    this.ws = connection;

    /**
      * Bucket to hold handlers, associated by event type
      * @type {SocketHandler}
      */
    this.handlers = {};

    /**
      * Array to hold unprocessed packets, sent before the client is ready
      * @type {array}
      */
    this.queue = [];

    // Register all events
    this.registerEvent(WSEvents.SESSION, require('./handlers/SessionHandler'));
    this.registerEvent(WSEvents.NEW_MESSAGE, require('./handlers/ChatHandler'));
    this.registerEvent(WSEvents.CHANNEL_INFO, require('./handlers/InfoHandler'));
    this.registerEvent(WSEvents.CHANNEL_EMOTE, require('./handlers/EmoteHandler'));
    this.registerEvent(WSEvents.CHANNEL_INVITE, require('./handlers/InviteHandler'));
    this.registerEvent(WSEvents.CHANNEL_WARN, require('./handlers/WarningHandler'));
    this.registerEvent(WSEvents.ONLINE_SET, require('./handlers/OnlineSetHandler'));
    this.registerEvent(WSEvents.USER_JOIN, require('./handlers/UserJoinHandler'));
    this.registerEvent(WSEvents.USER_LEAVE, require('./handlers/UserLeaveHandler'));
    this.registerEvent(WSEvents.CHANNEL_CAPTCHA, require('./handlers/CaptchaHandler'));
  }

  /**
    * Main client reference
    * @type {Client}
    * @readonly
    */
  get client() {
    return this.ws.client;
  }

  /**
    * Register an event handler module
    * @param {string} eventname Event name constant
    * @param {AbstractHandler} HandlerModule Target handler class
    * @returns {void}
    */
  registerEvent(eventname, HandlerModule) {
    this.handlers[eventname] = new HandlerModule(this);
  }

  /**
    * Invoke the route function for each awaiting packet in queue
    * @returns {void}
    */
  processQueue() {
    this.queue.forEach((element, index) => {
      this.route(this.queue[index], true);
      this.queue.splice(index, 1);
    });
  }

  /**
    * Dispatches incoming data to the proper handler
    * @param {object} packet Event packet data
    * @param {boolean} queue If processing packet from queue
    * @returns {boolean}
    */
  route(packet, queue = false) {
    if (this.ws.ignoredEvents[packet.cmd] !== undefined) return false;

    if (this.ws.status !== Status.READY) {
      if (BeforeReadyWhitelist.indexOf(packet.cmd) === -1) {
        this.queue.push(packet);
        return false;
      }
    }

    if (!queue && this.queue.length > 0) this.processQueue();
    if (this.handlers[packet.cmd]) return this.handlers[packet.cmd].handle(packet);
    return false;
  }
}

module.exports = PacketRouter;
