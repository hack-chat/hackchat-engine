const AbstractHandler = require('./AbstractHandler');
const { Events } = require('../../../util/Constants');

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
      * Emitted when the client recives a whisper packet
      * @event Client#whisper
      * @param {WhisperStruct} message The whisper event
      */
    client.emit(Events.CHANNEL_WHISPER, response.message);
  }
}

module.exports = WhisperHandler;
