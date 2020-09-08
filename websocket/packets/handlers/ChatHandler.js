const AbstractHandler = require('./AbstractHandler');
const { Events } = require('../../../util/Constants');

/**
  * Handles a new chat message that has been broadcast within a channel
  * @private
  */
class ChatHandler extends AbstractHandler {
  /**
    * Parses incoming packet data and emits related events
    * @param {object} packet Incoming packet data
    * @returns {void}
    */
  handle(packet) {
    const { client } = this.packetRouter;
    const response = client.events.Chat.handle(packet);

    /**
      * Emitted when a message is sent in a channel
      * @event Client#message
      * @param {MessageStruct} message The sent message
      */
    client.emit(Events.NEW_MESSAGE, response.message);
  }
}

module.exports = ChatHandler;
