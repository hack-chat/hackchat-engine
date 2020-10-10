const AbstractEvent = require('./AbstractEvent');
const WhisperStruct = require('../structures/WhisperStruct');

/**
  * This class handles an incoming `whisper` event from the server
  * @private
  */
class Whisper extends AbstractEvent {
  /**
    * Event handler function
    * @param {object} data Incoming event data
    * @returns {object}
    */
  handle(data) {
    const { client } = this;

    const user = client.users.find((val) => val.userid === data.userid);
    const message = new WhisperStruct(user, data, client);

    return {
      message,
    };
  }
}

module.exports = Whisper;
