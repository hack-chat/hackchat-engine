import AbstractHandler from './AbstractHandler.js';
import { Events } from '../../../util/Constants.js';

/**
  * Handles the data when user info is updated
  * @private
  */
class UpdateUserHandler extends AbstractHandler {
  /**
    * Parses incoming packet data and emits related events
    * @param {object} packet Incoming packet data
    * @returns {void}
    */
  handle(packet) {
    const { client } = this.packetRouter;
    const response = client.events.UpdateUser.handle(packet);

    /**
      * Emitted when a users info changed
      * @event Client#userUpdate
      * @param {User} user The user
      */
    client.emit(Events.USER_UPDATE, response);

    // Emit debug info
    client.emit(Events.DEBUG, `[${Events.USER_UPDATE}]: ${packet}`);
  }
}

export default UpdateUserHandler;
