const AbstractHandler = require('./AbstractHandler');
const { Events } = require('../../../util/Constants');

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
      * Emitted when the client recives an info packet
      * @event Client#information
      * @param {Information} message The created message
      */
    client.emit(Events.CHANNEL_INFO, response.message);
  }
}

module.exports = InfoHandler;
