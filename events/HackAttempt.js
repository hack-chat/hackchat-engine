import AbstractEvent from './AbstractEvent.js';
import HackAttemptStruct from '../structures/HackAttemptStruct.js';

/**
  * This class handles an incoming `hackattempt` event from the server
  * @private
  */
class PublicChannels extends AbstractEvent {
  /**
    * Event handler function
    * @param {object} data Incoming event data
    * @returns {object}
    */
  handle(data) {
    const { client } = this;
    const message = new HackAttemptStruct(client, data);

    return {
      message,
    };
  }
}

export default PublicChannels;
