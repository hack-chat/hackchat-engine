const AbstractEvent = require('./AbstractEvent');
const SessionStruct = require('../structures/SessionStruct');

/**
  * This class handles an incoming `session` event from the server
  * @todo Implement session restore
  * @private
  */
class Session extends AbstractEvent {
  /**
    * Event handler function
    * @param {object} data Incoming event data
    * @returns {object}
    */
  handle(data) {
    const { client } = this;
    const session = new SessionStruct(client, data);

    return {
      session,
    };
  }
}

module.exports = Session;
