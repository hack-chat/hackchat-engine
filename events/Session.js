import AbstractEvent from './AbstractEvent.js';
import SessionStruct from '../structures/SessionStruct.js';

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

export default Session;
