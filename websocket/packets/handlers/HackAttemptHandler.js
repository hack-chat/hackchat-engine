import AbstractHandler from './AbstractHandler.js';
import { Events } from '../../../util/Constants.js';

/**
  * Handles an incoming hackAttempt
  * @private
  */
class HackAttemptHandler extends AbstractHandler {
  /**
    * Parses incoming packet data and emits related events
    * @param {object} packet Incoming packet data
    * @returns {void}
    */
  handle(packet) {
    const { client } = this.packetRouter;
    const response = client.events.HackAttempt.handle(packet);

    /**
      * Emitted when the client receives a hackAttempt packet
      * @event Client#hackAttempt
      * @param {HackAttemptStruct} message The hack attempt event
      */
    client.emit(Events.HACK_ATTEMPT, response.message);

    // Emit debug info
    client.emit(Events.DEBUG, `[${Events.HACK_ATTEMPT}]: ${packet}`);
  }
}

export default HackAttemptHandler;
