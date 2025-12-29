/* eslint global-require: 0 */
import {
  Status,
  WSEvents,
  Events,
} from '../../util/Constants.js';

import SessionHandler from './handlers/SessionHandler.js';
import ChatHandler from './handlers/ChatHandler.js';
import InfoHandler from './handlers/InfoHandler.js';
import EmoteHandler from './handlers/EmoteHandler.js';
import InviteHandler from './handlers/InviteHandler.js';
import WarningHandler from './handlers/WarningHandler.js';
import OnlineSetHandler from './handlers/OnlineSetHandler.js';
import UserJoinHandler from './handlers/UserJoinHandler.js';
import UserLeaveHandler from './handlers/UserLeaveHandler.js';
import UpdateUserHandler from './handlers/UpdateUserHandler.js';
import CaptchaHandler from './handlers/CaptchaHandler.js';
import WhisperHandler from './handlers/WhisperHandler.js';
import PubChannelsHandler from './handlers/PubChannelsHandler.js';
import HackAttemptHandler from './handlers/HackAttemptHandler.js';
import SignMessageHandler from './handlers/SignMessageHandler.js';
import SignTransactionHandler from './handlers/SignTransactionHandler.js';

const BeforeReadyWhitelist = [
  WSEvents.SESSION,
  WSEvents.PUB_CHANS,
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

    /**
      * Custom handlers registered by the user for unmapped commands
      * @type {Map<string, function(object): void>}
      */
    this.customHandlers = new Map();

    // Register all events
    this.registerEvent(WSEvents.SESSION, SessionHandler);
    this.registerEvent(WSEvents.NEW_MESSAGE, ChatHandler);
    this.registerEvent(WSEvents.CHANNEL_INFO, InfoHandler);
    this.registerEvent(WSEvents.CHANNEL_EMOTE, EmoteHandler);
    this.registerEvent(WSEvents.CHANNEL_INVITE, InviteHandler);
    this.registerEvent(WSEvents.CHANNEL_WARN, WarningHandler);
    this.registerEvent(WSEvents.ONLINE_SET, OnlineSetHandler);
    this.registerEvent(WSEvents.USER_JOIN, UserJoinHandler);
    this.registerEvent(WSEvents.USER_LEAVE, UserLeaveHandler);
    this.registerEvent(WSEvents.USER_UPDATE, UpdateUserHandler);
    this.registerEvent(WSEvents.CHANNEL_CAPTCHA, CaptchaHandler);
    this.registerEvent(WSEvents.CHANNEL_WHISPER, WhisperHandler);
    this.registerEvent(WSEvents.PUB_CHANS, PubChannelsHandler);
    this.registerEvent(WSEvents.HACK_ATTEMPT, HackAttemptHandler);
    this.registerEvent(WSEvents.SIGN_MESSAGE, SignMessageHandler);
    this.registerEvent(WSEvents.SIGN_TRANSACTION, SignTransactionHandler);
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
    * Registers a custom command handler
    * @param {string} cmd The command string
    * @param {function(object): void} handler The function to execute
    */
  registerCustomCommand(cmd, handler) {
    this.customHandlers.set(cmd, handler);
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

    const customHandler = this.customHandlers.get(packet.cmd);
    if (customHandler) {
      this.client.emit(Events.DEBUG, `[router] Executing custom handler for cmd: ${packet.cmd}`);
      customHandler(packet);

      return true;
    }

    return false;
  }
}

export default PacketRouter;
