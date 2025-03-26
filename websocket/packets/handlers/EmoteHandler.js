import AbstractHandler from './AbstractHandler.js';
import { Events } from '../../../util/Constants.js';

/**
  * Handles an emote packet received from the server
  * @private
  */
class EmoteHandler extends AbstractHandler {
  /**
    * Parses incoming packet data and emits related events
    * @param {object} packet Incoming packet data
    * @returns {void}
    */
  handle(packet) {
    const { client } = this.packetRouter;
    const response = client.events.Emote.handle(packet);

    /**
      * Emitted when the client receives an emote packet
      * @event Client#emote
      * @param {Emote} message The created message
      */
    client.emit(Events.CHANNEL_EMOTE, response.message);

    // Emit debug info
    client.emit(Events.DEBUG, `[${Events.CHANNEL_EMOTE}]: ${packet}`);
  }
}

export default EmoteHandler;
