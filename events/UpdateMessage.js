import AbstractEvent from './AbstractEvent.js';
import UpdateMessageStruct from '../structures/UpdateMessageStruct.js';

/**
  * This class handles an incoming `updateMessage` event from the server
  * @private
  */
class UpdateMessage extends AbstractEvent {
  /**
    * Event handler function
    * @param {object} data Incoming event data
    * @returns {object}
    */
  handle(data) {
    const { client } = this;
    const update = new UpdateMessageStruct(client, data);

    return {
      update,
    };
  }
}

export default UpdateMessage;
