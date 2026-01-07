import AbstractHandler from './AbstractHandler.js';
import { Events } from '../../../util/Constants.js';

/**
  * Handles an updateMessage packet received from the server
  * @private
  */
class UpdateMessageHandler extends AbstractHandler {
  /**
    * Parses incoming packet data and emits related events
    * @param {object} packet Incoming packet data
    * @returns {void}
    */
  handle(packet) {
    const { client } = this.packetRouter;
    const response = client.events.UpdateMessage.handle(packet);

    /**
      * Emitted when a message update is received
      * @event Client#updateMessage
      * @param {UpdateMessageStruct} update The update details
      */
    client.emit(Events.UPDATE_MESSAGE, response.update);

    // Emit debug info
    client.emit(Events.DEBUG, `[${Events.UPDATE_MESSAGE}]: ${packet}`);
  }
}

export default UpdateMessageHandler;
