import AbstractEvent from './AbstractEvent.js';

/**
  * This class handles an incoming `signTransaction` event from the server
  * @private
  */
class SignTransaction extends AbstractEvent {
  /**
    * Event handler function
    * @param {object} data Incoming event data
    * @returns {object}
    */
  handle(data) {
    const { client } = this;
    client.lastSign = data;

    return {
      data,
    };
  }
}

export default SignTransaction;
