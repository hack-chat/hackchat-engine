import AbstractEvent from './AbstractEvent.js';
import WarningStruct from '../structures/WarningStruct.js';

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

export default Warning;
