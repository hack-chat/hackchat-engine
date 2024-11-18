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

const util = new Util();

/**
  * Main client interface
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
      * Create the event manager for this client
      * @type {EventsManager}
      */
    this.events = new EventsManager(this);

    /**
      * Stored time that the client was last ready
      * @type {Date}
      */
    this.readyAt = null;

    /**
      * User info for this client
      * @type {ClientStruct}
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
      * Active timeouts set on this client
      * @type {Set}
      */
    this.timeouts = new Set();

    /**
      * Active intervals set on this client
      * @type {Set<Timeout>}
      */
    this.intervals = new Set();

    /**
      * Internal check to see if this code is run in node or a browser
      * @type {Set<Timeout>}
      */
    this.isBrowser = typeof window !== 'undefined';

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
    * @type {number}
    * @readonly
    */
  get uptime() {
    return this.readyAt ? Date.now() - this.readyAt : null;
  }

  /**
    * Timestamp of the time the client when it was last ready
    * @type {number}
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
    * @param {string} channel Channel to auto join
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
    */
  async connectToWebSocket() {
    try {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => { // anti-pattern my ass
        this.emit(Events.DEBUG, '[client] Initiating connection. . .');

        const timeout = this.setTimeout(
          () => reject(new Error(Errors.TOOK_TOO_LONG)),
          1000 * 300,
        );

        let { gateway } = this.options.ws;

        if (this.browser) {
          this.emit(Events.DEBUG, '[client] Fetching ws config');
          const conf = await util.fetchWebsocketConfig();
          gateway = conf.gateway;
        }

        this.emit(Events.DEBUG, `[client] Using gateway ${gateway}`);

        this.ws.connect(gateway);
        this.ws.connection.once('error', reject);

        this.once(Events.READY, () => {
          this.clearTimeout(timeout);
          resolve();
        });
      });
    } catch (e) {
      this.destroy();
      return Promise.reject(e);
    }
  }

  /**
    * Terminates the websocket connection and destroys the client
    * @returns {Promise}
    */
  destroy() {
    for (const t of this.timeouts) clearTimeout(t); // eslint-disable-line no-restricted-syntax
    for (const i of this.intervals) clearInterval(i); // eslint-disable-line no-restricted-syntax
    this.timeouts.clear();
    this.intervals.clear();
    return Promise.resolve();
  }

  /**
    * Create a managed timeout
    * @param {Function} func Target function to call
    * @param {number} delay Wait time before calling func
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
    * @param {number} delay Wait time before calling func
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
}

export default Client;
