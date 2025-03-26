import AbstractHandler from './AbstractHandler.js';
import { Events } from '../../../util/Constants.js';

/**
  * Handles an invite packet received from the server
  * @private
  */
class InviteHandler extends AbstractHandler {
  /**
    * Parses incoming packet data and emits related events
    * @param {object} packet Incoming packet data
    * @returns {void}
    */
  handle(packet) {
    const { client } = this.packetRouter;
    const response = client.events.Invite.handle(packet);

    /**
      * Emitted when the client receives an invite packet
      * @event Client#invite
      * @param {Invite} message The created message
      */
    client.emit(Events.CHANNEL_INVITE, response.message);

    // Emit debug info
    client.emit(Events.DEBUG, `[${Events.CHANNEL_INVITE}]: ${packet}`);
  }
}

export default InviteHandler;
