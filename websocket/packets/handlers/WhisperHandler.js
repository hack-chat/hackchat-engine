import AbstractHandler from './AbstractHandler.js';
import { Events } from '../../../util/Constants.js';

/**
  * Handles an info packet received from the server
  * @private
  */
class WhisperHandler extends AbstractHandler {
  /**
    * Parses incoming packet data and emits related events
    * @param {object} packet Incoming packet data
    * @returns {void}
    */
  handle(packet) {
    const { client } = this.packetRouter;
    const response = client.events.Whisper.handle(packet);

    /**
      * Emitted when the client receives a whisper packet
      * @event Client#whisper
      * @param {WhisperStruct} message The whisper event
      */
    client.emit(Events.CHANNEL_WHISPER, response.message);

    // Emit debug info
    client.emit(Events.DEBUG, `[${Events.CHANNEL_WHISPER}]: ${packet}`);
  }
}

export default WhisperHandler;
