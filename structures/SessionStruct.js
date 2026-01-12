/**
  * This class handles parsing of the data of a `session` event
  * @todo Implement session restore
  */
class SessionStruct {
  constructor(client, data) {
    /**
      * Add client reference
      * @type {Client}
      * @readonly
      */
    Object.defineProperty(this, 'client', { value: client });

    this.setup(data);
  }

  /**
    * Fill in this structure with provided data
    * @param {object} data Incoming event data
    * @returns {void}
    */
  setup(data) {
    /**
      * Currently connected channels
      * @type {object}
      */
    this.channels = data.channels;

    /**
      * Was this a new or renewed session
      * @type {boolean}
      */
    this.restored = data.restored;

    /**
      * The new token
      * @type {string}
      */
    this.token = data.token;
  }
}

export default SessionStruct;
