import AbstractEvent from './AbstractEvent.js';
import WhisperStruct from '../structures/WhisperStruct.js';

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
    const message = new WhisperStruct(client, data);

    return {
      message,
    };
  }
}

export default Whisper;
