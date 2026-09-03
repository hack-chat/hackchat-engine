import AbstractHandler from './AbstractHandler.js';
import { Events } from '../../../util/Constants.js';

/**
  * Handles a password request received while attempting to join a channel
  * @private
  */
class PasswordReqHandler extends AbstractHandler {
  /**
    * Parses incoming packet data and emits related events
    * @param {object} packet Incoming packet data
    * @returns {void}
    */
  handle(packet) {
    const { client } = this.packetRouter;
    const response = client.events.PasswordReq.handle(packet);

    /**
      * Emitted when a password request is encountered
      * @event Client#gotPasswordReq
      * @param {PasswordReqStruct} passwordReqData The password request data
      */
    client.emit(Events.CHANNEL_PASSWORD_REQ, response);

    // Emit debug info
    client.emit(Events.DEBUG, `[${Events.CHANNEL_PASSWORD_REQ}]: ${JSON.stringify(packet)}`);
  }
}

export default PasswordReqHandler;
