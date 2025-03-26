import AbstractHandler from './AbstractHandler.js';
import { Events } from '../../../util/Constants.js';

/**
  * Handles an incoming public channels event
  * @private
  */
class PubChannelsHandler extends AbstractHandler {
  /**
    * Parses incoming packet data and emits related events
    * @param {object} packet Incoming packet data
    * @returns {void}
    */
  handle(packet) {
    const { client } = this.packetRouter;
    const response = client.events.PublicChannels.handle(packet);

    /**
      * Emitted when the client receives a publicchannels packet
      * @event Client#publicchannels
      * @param {PubChannelsStruct} message The publicchannels event
      */
    client.emit(Events.PUB_CHANS, response.message);

    // Emit debug info
    client.emit(Events.DEBUG, `[${Events.PUB_CHANS}]: ${packet}`);
  }
}

export default PubChannelsHandler;
