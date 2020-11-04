import AbstractHandler from './AbstractHandler.js';
import { Events } from '../../../util/Constants.js';

/**
  * Handles the data when a user leaves a channel
  * @private
  */
class UserLeaveHandler extends AbstractHandler {
  /**
    * Parses incoming packet data and emits related events
    * @param {object} packet Incoming packet data
    * @returns {void}
    */
  handle(packet) {
    const { client } = this.packetRouter;
    const response = client.events.UserLeave.handle(packet);

    /**
      * Emitted when a user has left a channel
      * @event Client#userLeft
      * @param {User} user The user who left
      */
    client.emit(Events.USER_LEAVE, response);

    // Emit debug info
    client.emit(Events.DEBUG, `[${Events.USER_LEAVE}]: ${packet}`);
  }
}

export default UserLeaveHandler;
