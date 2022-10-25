import EventEmitter from 'events';
import { Status } from '../util/Constants.js';
import SocketHandler from './SocketHandler.js';

/**
  * WebSocket Controller for the client interface
  * @private
  */
class SocketController extends EventEmitter {
  constructor(client) {
    super();

    /**
      * Client class that created this controller
      * @type {Client}
      */
    this.client = client;

    /**
      * Socket Handler of this controller
      * @type {SocketHandler}
      */
    this.connection = null;
  }

  /**
    * Emit a debug message
    * @param {string} message Debug string
    * @returns {void}
    */
  debug(message) {
    return this.client.emit('debug', `[socket controller] ${message}`);
  }

  /**
    * Destroy this session
    * @returns {boolean} Destruction success
    */
  destroy() {
    if (!this.connection) {
      this.debug('[socket controller] With strange aeons even death may die. . .');
      return false;
    }

    return this.connection.destroy();
  }

  /**
    * Push a message through the available socket
    * @param {object} packet Data to push
    * @returns {void}
    */
  send(packet) {
    if (!this.connection) {
      this.debug('[socket controller] Cannot send: not connected');
      return;
    }

    this.connection.send(packet);
  }

  /**
    * Create the connection using the specified gateway address
    * @param {string} gateway Gateway address to connect to
    * @returns {boolean} Connection initiated
    */
  connect(gateway) {
    if (!this.connection) {
      this.connection = new SocketHandler(this, gateway, this.client.options.session);
      return true;
    }

    switch (this.connection.status) {
      case Status.IDLE:
        // Already connection, 0x90
        break;
      case Status.DISCONNECTED:
        // Was connected, but no longer. Retry after 5.5 seconds
        this.connection.connect(gateway, 5500);
        return true;
      default:
        this.debug(`[socket controller] Failed to connect to ${gateway} due to state: ${this.connection.status}`);
        return false;
    }

    return false;
  }
}

export default SocketController;
