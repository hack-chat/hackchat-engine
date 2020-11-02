/**
  * This class handles parsing of the data of an `emote` event
  */
class Emote {
  constructor(client, user, data) {
    /**
      * Add client reference
      * @type {Client}
      * @readonly
      */
    Object.defineProperty(this, 'client', { value: client });

    /**
       * User who sent the emote
       * @type {User}
       * @readonly
       */
    Object.defineProperty(this, 'user', { value: user });

    this.setup(data);
  }

  /**
    * Fill in this structure with provided data
    * @param {object} data Incoming event data
    * @returns {void}
    */
  setup(data) {
    /**
      * The sent emote text
      * @type {string}
      */
    this.content = data.text;

    /**
      * The channel that the event occured in
      * @type {string}
      */
    this.channel = data.channel;
  }
}

export default Emote;
