const AbstractEvent = require('./AbstractEvent');
const InformationStruct = require('../structures/InformationStruct');

/**
  * This class handles an incoming `info` event from the server
  * @private
  */
class Info extends AbstractEvent {
  /**
    * Event handler function
    * @param {object} data Incoming event data
    * @returns {object}
    */
  handle(data) {
    const { client } = this;
    const message = new InformationStruct(client, data);

    return {
      message,
    };
  }
}

module.exports = Info;
