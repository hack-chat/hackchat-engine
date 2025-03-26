import AbstractHandler from './AbstractHandler.js';
import { Events } from '../../../util/Constants.js';

/**
  * Handles an info packet received from the server
  * @private
  */
class InfoHandler extends AbstractHandler {
  /**
    * Parses incoming packet data and emits related events
    * @param {object} packet Incoming packet data
    * @returns {void}
    */
  handle(packet) {
    const { client } = this.packetRouter;
    const response = client.events.Info.handle(packet);

    /**
      * Emitted when the client receives an info packet
      * @event Client#information
      * @param {Information} message The created message
      */
    client.emit(Events.CHANNEL_INFO, response.message);

    // Emit debug info
    client.emit(Events.DEBUG, `[${Events.CHANNEL_INFO}]: ${packet}`);
  }
}

export default InfoHandler;
