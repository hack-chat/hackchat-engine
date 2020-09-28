const AbstractEvent = require('./AbstractEvent');
const EmoteStruct = require('../structures/EmoteStruct');

/**
  * This class handles an incoming `emote` event from the server
  * @private
  */
class Emote extends AbstractEvent {
  /**
    * Event handler function
    * @param {object} data Incoming event data
    * @returns {object}
    */
  handle(data) {
    const { client } = this;

    const user = client.users.find((val) => val.userid === data.userid);
    const message = new EmoteStruct(client, user, data);

    return {
      message,
    };
  }
}

module.exports = Emote;
