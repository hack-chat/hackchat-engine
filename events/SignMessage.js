import AbstractEvent from './AbstractEvent.js';

/**
  * This class handles an incoming `signMessage` event from the server
  * @private
  */
class SignMessage extends AbstractEvent {
  /**
    * Event handler function
    * @param {object} data Incoming event data
    * @returns {object}
    */
  handle(data) {
    const { client } = this;
    client.lastMsg = data;

    return {
      data,
    };
  }
}

export default SignMessage;
