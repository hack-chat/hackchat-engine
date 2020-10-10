const AbstractEvent = require('./AbstractEvent');
const MessageStruct = require('../structures/MessageStruct');

/**
  * This class handles an incoming `chat` event from the server
  * @private
  */
class Chat extends AbstractEvent {
  /**
    * Event handler function
    * @param {object} data Incoming event data
    * @returns {object}
    */
  handle(data) {
    const { client } = this;
    const user = client.users.get(data.userid);
    const message = new MessageStruct(user, data, client);
    user.setLastMessage(message);

    return {
      message,
    };
  }
}

module.exports = Chat;
