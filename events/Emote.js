import AbstractEvent from './AbstractEvent.js';
import EmoteStruct from '../structures/EmoteStruct.js';

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

export default Emote;
