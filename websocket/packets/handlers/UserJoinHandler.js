import AbstractHandler from './AbstractHandler.js';
import { Events } from '../../../util/Constants.js';

/**
  * Handles the data when a new user joins
  * @private
  */
class UserJoinHandler extends AbstractHandler {
  /**
    * Parses incoming packet data and emits related events
    * @param {object} packet Incoming packet data
    * @returns {void}
    */
  handle(packet) {
    const { client } = this.packetRouter;
    const response = client.events.UserJoin.handle(packet);

    /**
      * Emitted when a new user has joined a channel
      * @event Client#userJoined
      * @param {User} user The new user
      */
    client.emit(Events.USER_JOIN, response);

    // Emit debug info
    client.emit(Events.DEBUG, `[${Events.USER_JOIN}]: ${packet}`);
  }
}

export default UserJoinHandler;
