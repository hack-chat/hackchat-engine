import { OPCodes } from '../util/Constants.js';

/**
  * This class handles parsing of the data of a `chat` event and
  * provides helper functions to work with the message
  */
class MessageStruct {
  /**
    * @param {User} user User structure of sender
    * @param {object} data Incoming event data
    * @param {Client} client Main client reference
    */
  constructor(user, data, client) {
    /**
       * Add client reference
       * @type {Client}
       * @readonly
       */
    Object.defineProperty(this, 'client', { value: client });

    /**
      * Channel which message was sent through
      * @type {Channel}
      */
    this.channel = data.channel;

    /**
      * User structure of sender
      * @type {User}
      */
    this.user = user;

    if (data) this.setup(data);
  }

  /**
    * Fill in this structure with provided data
    * @param {object} data Incoming event data
    * @returns {void}
    */
  setup(data) {
    /**
      * Text content of message
      * @type {string}
      */
    this.content = data.text;

    /**
      * Creation timestamp
      * @type {number}
      */
    this.timestamp = new Date();
  }

  /**
    * Get creation timestamp as Date
    * @type {Date}
    * @readonly
    */
  get createdAt() {
    return new Date(this.timestamp);
  }

  /**
    * Reply to the message.
    * @param {string} text The content for the message
    * @returns {Promise}
    * @example
    * // Automated reply
    * msg.reply(`${msg.user} no, just no`)
    *   .then(sent => console.log(`Refused ${sent.user}'s advances`))
    *   .catch(console.error);
    */
  async reply(text) {
    try {
      return new Promise((resolve) => {
        this.client.ws.send({
          cmd: OPCodes.CHAT,
          channel: this.channel,
          text,
        });
        resolve(this);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
    * When referenced as a string, output `contents` instead of type
    * @returns {string}
    * @example
    * console.log(`Message: ${msg}`);
    */
  toString() {
    return this.content;
  }
}

export default MessageStruct;
