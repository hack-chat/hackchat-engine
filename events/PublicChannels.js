import AbstractEvent from './AbstractEvent.js';
import PubChannelsStruct from '../structures/PubChannelsStruct.js';

/**
  * This class handles an incoming `publicchannels` event from the server
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
    const message = new PubChannelsStruct(client, data);

    return {
      message,
    };
  }
}

export default PublicChannels;
