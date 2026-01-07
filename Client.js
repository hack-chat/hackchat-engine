import EventEmitter from 'events';
import {
  DefaultOptions,
  Events,
  Errors,
  OPCodes,
} from './util/Constants.js';
import Util from './util/Util.js';
import SocketController from './websocket/SocketController.js';
import EventsManager from './events/EventsManager.js';
import ExtMap from './util/ExtMap.js';

/**
  * Main client interface for the hack.chat protocol
  * @extends {EventEmitter}
  */
class Client extends EventEmitter {
  /**
    * @param {object} options Options for this client
    */
  constructor(options = {}) {
    super();

    /**
      * Merge passed options with defaults and store
      * @type {object}
      */
    this.options = {
      ...DefaultOptions,
      ...options,
    };

    /**
     * Create the websocket manager for this client
     * @type {SocketController}
     */
    this.ws = new SocketController(this);

    /**
      * Create the event manager for this client, responsible for data structure mapping
      * @type {EventsManager}
      */
    this.events = new EventsManager(this);

    /**
      * Stored time that the client was last ready
      * @type {Date|null}
      */
    this.readyAt = null;

    /**
      * User info for this client
      * @type {ClientStruct|null}
      */
    this.myUser = null;

    /**
      * Store all known users into a new ExtMap
      * @type {ExtMap}
      */
    this.users = new ExtMap();

    /**
      * Store all current channels that this client is subscribed to
      * @type {ExtMap}
      */
    this.channels = new ExtMap();

    /**
      * Active timeouts set on this client, managed for destruction
      * @type {Set<Timeout>}
      */
    this.timeouts = new Set();

    /**
      * Active intervals set on this client, managed for destruction
      * @type {Set<Timeout>}
      */
    this.intervals = new Set();

    /**
      * Internal check to see if this code is run in node or a browser
      * @type {boolean}
      */
    this.isBrowser = typeof window !== 'undefined';

    this.util = new Util();

    /**
      * Initiate websocket connection
      */
    this.connectToWebSocket().then(() => {
      this.emit(Events.DEBUG, '[client] Client ready');
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
    });
  }

  /**
    * Clients connection status
    * @type {number}
    * @readonly
    */
  get status() {
    return this.ws.connection.status;
  }

  /**
    * How long this client has been connected, in milliseconds
    * @type {number|null}
    * @readonly
    */
  get uptime() {
    return this.readyAt ? Date.now() - this.readyAt : null;
  }

  /**
    * Timestamp of the time the client when it was last ready
    * @type {number|null}
    * @readonly
    */
  get readyTimestamp() {
    return this.readyAt ? this.readyAt.getTime() : null;
  }

  /**
    * Client running in the browser or nodejs
    * @type {boolean}
    * @readonly
    */
  get browser() {
    return this.isBrowser;
  }

  /**
    * Sends a join event to the hackchat server
    * @param {string} name Name to join with
    * @param {string} password Optional password to create trip code
    * @param {string} channel Channel to join
    * @returns {void}
    */
  join(name = false, password = '', channel = false) {
    try {
      if (!name || typeof name !== 'string') {
        throw new Error(Errors.INVALID_NAME);
      }

      if (!channel || typeof channel !== 'string') {
        throw new Error(Errors.INVALID_CHANNEL);
      }

      // @todo: this will be changed with the multichannel patch
      this.channel = channel;

      this.ws.send({
        cmd: OPCodes.JOIN,
        nick: name,
        pass: password,
        channel,
      });
    } catch (e) {
      this.destroy();
      this.emit(Events.ERROR, `[client] Error joining channel: ${e}`);
    }
  }

  /**
    * Establishes communication with a hackchat server
    * @returns {Promise<void>}
    */
  async connectToWebSocket() {
    try {
      return new Promise((resolve, reject) => {
        this.emit(Events.DEBUG, '[client] Initiating connection. . .');

        const timeout = this.setTimeout(
          () => reject(new Error(Errors.TOOK_TOO_LONG)),
          1000 * 300,
        );

        const { gateway } = this.options.ws;

        const initiateConnection = (gw) => {
          this.emit(Events.DEBUG, `[client] Using gateway ${gw}`);

          const success = this.ws.connect(gw);
          if (!success) {
            reject(new Error('Connection failed to start (Socket likely not IDLE)'));
            return;
          }

          this.ws.connection.once('error', reject);

          this.once(Events.READY, () => {
            this.clearTimeout(timeout);
            resolve();
          });
        };

        if (this.browser) {
          this.emit(Events.DEBUG, '[client] Fetching ws config');
          this.util.fetchWebsocketConfig()
            .then((conf) => initiateConnection(conf.gateway))
            .catch(reject);
        } else {
          initiateConnection(gateway);
        }
      });
    } catch (e) {
      this.destroy();
      return Promise.reject(e);
    }
  }

  /**
    * Terminates the websocket connection and destroys the client
    * @returns {Promise<void>}
    */
  destroy() {
    for (const t of this.timeouts) clearTimeout(t); // eslint-disable-line no-restricted-syntax
    for (const i of this.intervals) clearInterval(i); // eslint-disable-line no-restricted-syntax
    this.timeouts.clear();
    this.intervals.clear();
    this.ws.destroy();
    return Promise.resolve();
  }

  /**
    * Create a managed timeout
    * @param {Function} func Target function to call
    * @param {number} delay Wait time before calling func (in ms)
    * @param {...*} args Optional arguments to pass to func
    * @returns {Timeout}
    */
  setTimeout(func, delay, ...args) {
    const timeout = setTimeout(() => {
      func(...args);
      this.timeouts.delete(timeout);
    }, delay);

    this.timeouts.add(timeout);

    return timeout;
  }

  /**
    * Clear a managed timeout
    * @param {Timeout} timeout Target timeout to cancel
    */
  clearTimeout(timeout) {
    clearTimeout(timeout);
    this.timeouts.delete(timeout);
  }

  /**
    * Create a managed interval
    * @param {Function} func Target function to call
    * @param {number} delay Wait time before calling func (in ms)
    * @param {...*} args Optional arguments to pass to func
    * @returns {Timeout}
    */
  setInterval(func, delay, ...args) {
    const interval = setInterval(func, delay, ...args);

    this.intervals.add(interval);

    return interval;
  }

  /**
    * Clear a managed interval
    * @param {Timeout} interval Target interval to cancel
    */
  clearInterval(interval) {
    clearInterval(interval);
    this.intervals.delete(interval);
  }

  /**
    * Send `changecolor` operation to the server
    * @param {string} newColor HTML color code
    */
  changeColor(newColor) {
    this.ws.send({
      cmd: OPCodes.CHANGE_COLOR,
      color: newColor,
    });
  }

  /**
    * Send `chat` operation to the server
    * @param {string} channel Target channel to send `text`
    * @param {string} text `chat` text to send
    */
  say(channel, text) {
    this.ws.send({
      cmd: OPCodes.CHAT,
      channel,
      text,
    });
  }

  /**
    * Send `enablecaptcha` operation to the server
    * @param {string} channel Target channel to captcha
    */
  enableCaptcha(channel) {
    this.ws.send({
      cmd: OPCodes.ENABLE_CAPTCHA,
      channel,
    });
  }

  /**
    * Send `disablecaptcha` operation to the server
    * @param {string} channel Target channel to uncaptcha
    */
  disableCaptcha(channel) {
    this.ws.send({
      cmd: OPCodes.DISABLE_CAPTCHA,
      channel,
    });
  }

  /**
    * Send `lockroom` operation to the server
    * @param {string} channel Target channel to lock
    */
  lockChannel(channel) {
    this.ws.send({
      cmd: OPCodes.LOCK_ROOM,
      channel,
    });
  }

  /**
    * Send `unlockroom` operation to the server
    * @param {string} channel Target channel to unlock
    */
  unlockChannel(channel) {
    this.ws.send({
      cmd: OPCodes.UNLOCK_ROOM,
      channel,
    });
  }

  /**
    * Registers a handler for a specific, unmapped command (cmd)
    * This allows the client to process custom packets without needing the 'raw' event
    * @param {string} cmd The command string from the server (e.g., 'signMessage')
    * @param {function(object): void} handler The function to execute when the command is received
    *
    * @example
    * import { Client } from 'hackchat-engine';
    * const hcClient = new Client({
    *   isBot: false,
    * });
    * hcClient.onCommand('example', (payload) => {
    *   // This function only fires when { cmd: 'example' } is received
    *   console.log(payload);
    * });
    */
  onCommand(cmd, handler) {
    if (!this.ws.connection || !this.ws.connection.packetRouter) {
      this.emit(Events.WARN, `Cannot register command '${cmd}': Router not initialized.`);
      return;
    }

    this.ws.connection.packetRouter.registerCustomCommand(cmd, handler);
  }

  /**
    * Sends a Solana signature and the signed message back to the server for verification
    * @param {string} signature The base64 or hex encoded signature from the client's wallet
    * @param {string} signedMessage The original human-readable message that was signed
    */
  requestSiw(wallet, address) {
    this.ws.send({
      cmd: OPCodes.REQUEST_SIW,
      wallet,
      address,
    });
  }

  /**
    * Sends a Solana signature and the signed message back to the server for verification
    * @param {string} signature The base64 or hex encoded signature from the client's wallet
    * @param {string} signedMessage The original human-readable message that was signed
    */
  sendSignature(signature, signedMessage) {
    this.ws.send({
      cmd: OPCodes.SIGN_SIW,
      signature,
      signedMessage,
    });
  }

  /**
    * Sends a signed transaction back to the server for broadcasting
    * @param {string} signedTransaction The base64 encoded signed transaction object
    */
  sendSignedTransaction(signedTransaction) {
    this.ws.send({
      cmd: OPCodes.CONFIRM_TX,
      signedTransaction,
    });
  }

  /**
    * Send `updateMessage` operation to the server
    * @param {string} customId The customId of the target message
    * @param {string} text The text to apply
    * @param {string} [mode='overwrite'] The update mode:
    *   'overwrite', 'append', 'prepend', or 'complete'
    */
  updateMessage(customId, text, mode = 'overwrite') {
    this.ws.send({
      cmd: OPCodes.UPDATE_MESSAGE,
      channel: this.channel, // @todo Multichannel
      customId,
      text,
      mode,
    });
  }

  /**
    * Request the public wallet address of a specific user
    * @param {number|string} target The userid (number) or nickname (string) of the user
    */
  getWallet(target) {
    const payload = {
      cmd: OPCodes.GET_WALLET,
      channel: this.channel, // @todo Multichannel
    };

    if (typeof target === 'number') {
      payload.userid = target;
    } else {
      payload.nick = target;
    }

    this.ws.send(payload);
  }
}

export default Client;
