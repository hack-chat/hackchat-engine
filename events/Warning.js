const AbstractEvent = require('./AbstractEvent');
const WarningStruct = require('../structures/WarningStruct');

/**
  * This class handles an incoming `warning` event from the server
  * @private
  */
class Warning extends AbstractEvent {
  /**
    * Event handler function
    * @param {object} data Incoming event data
    * @returns {object}
    */
  handle(data) {
    const { client } = this;
    const warn = new WarningStruct(client, data);

    return {
      warn,
    };
  }
}

module.exports = Warning;
