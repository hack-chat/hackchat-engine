/**
  * This class handles parsing of the data of a `hackAttempt` event
  */
class HackAttemptStruct {
  /**
    * @param {Channel} channel Channel that the hackAttempt was sent through
    * @param {Number} fromId User id of requester
    * @param {User} from User whomst'd sent the hackAttempt
    * @param {String} fromNick User name of whomst'd sent the hackAttempt
    * @param {String} lib Target library
    * @param {Client} client Main client reference
    */
  constructor(client, data) {
    /**
      * Add client reference
      * @type {Client}
      * @readonly
      */
    Object.defineProperty(this, 'client', { value: client });

    if (data) this.setup(data);
  }

  /**
    * Fill in this structure with provided data
    * @param {object} data Incoming event data
    * @returns {void}
    */
  setup(data) {
    /**
      * Origin channel of the request
      * @type {string}
      */
    this.channel = data.channel;

    /**
      * Userid of request sender
      * @type {number}
      */
    this.fromId = data.from;

    /**
      * The user who sent the whisper
      * @type {User}
      */
    this.from = this.client.users.find((val) => val.userid === data.from);

    /**
      * Name of request sender
      * @type {string}
      */
    this.fromNick = data.fromNick;

    /**
      * URL to requested library
      * @type {string}
      */
    this.lib = data.lib;

    /**
      * The timestamp the publicchannels was sent at
      * @type {number}
      */
    this.timestamp = new Date();
  }

  /**
    * When referenced as a string, output the content instead of an object type
    * @returns {string}
    */
  toString() {
    return `${this.fromNick} suggested ${this.lib}`;
  }
}

export default HackAttemptStruct;
