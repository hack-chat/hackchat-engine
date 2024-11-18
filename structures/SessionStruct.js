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
      * Current channel count
      * @type {number}
      */
    this.channelCount = data.chans;

    /**
      * Available public channels and their user count
      * @type {object}
      */
    this.publicChannels = data.public;

    /**
      * Current session id
      * @type {string}
      */
    this.sessionID = data.sessionID;

    /**
      * Current channel count
      * @type {number}
      */
    this.userCount = data.users;

    /**
      * Was this a new or renewed session
      * @type {boolean}
      */
    this.restored = data.restored;

    // add non-standard properties
    const dataKeys = Object.keys(data);
    for (let i = 0, j = dataKeys.length; i < j; i += 1) {
      if (dataKeys[i] !== 'cmd' && dataKeys[i] !== 'time') {
        this[dataKeys[i]] = data[dataKeys[i]];
      }
    }
  }
}

export default SessionStruct;
