const AbstractEvent = require('./AbstractEvent');
const { Events } = require('../util/Constants');
const InformationStruct = require('../structures/InformationStruct');

/**
  * These structures will be moved into their own seperate event handlers
  * @todo
  * @legacy
  */
const EmoteStruct = require('../structures/EmoteStruct');
const WhisperStruct = require('../structures/WhisperStruct');

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
    let user;
    let message;

    /**
       * Pull info type from event, these will be under their own events
       * @todo Seperate events and remove eventType from return
       * @legacy
       */
    let eventType = Events.CHANNEL_INFO;
    switch (data.type) {
      case 'emote':
        eventType = Events.CHANNEL_EMOTE;
        user = client.users.find((val) => val.name === data.nick);
        message = new EmoteStruct(client, user, data);
        break;
      case 'whisper':
        eventType = Events.CHANNEL_WHISPER;
        user = client.users.find((val) => val.name === data.from);
        message = new WhisperStruct(client.channel, user, data, client);
        break;
      default:
        message = new InformationStruct(client, data);
        break;
    }

    return {
      eventType,
      message,
    };
  }
}

module.exports = Info;
