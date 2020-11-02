import AbstractEvent from './AbstractEvent.js';
import InformationStruct from '../structures/InformationStruct.js';

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

export default Info;
