import AbstractHandler from './AbstractHandler.js';
import { Events } from '../../../util/Constants.js';

/**
  * Handles the data from warnings sent by the server
  * @private
  */
class WarningHandler extends AbstractHandler {
  /**
    * Parses incoming packet data and emits related events
    * @param {object} packet Incoming packet data
    * @returns {void}
    */
  handle(packet) {
    const { client } = this.packetRouter;
    const response = client.events.Warning.handle(packet);

    /**
      * Emitted when the server sends a warning
      * @event Client#warning
      * @param {Warning} warning The sent warning
      */
    client.emit(Events.CHANNEL_WARN, response.warn);

    // Emit debug info
    client.emit(Events.DEBUG, `[${Events.CHANNEL_WARN}]: ${packet}`);
  }
}

export default WarningHandler;
