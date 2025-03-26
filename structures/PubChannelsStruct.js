/**
  * This class handles parsing of the data of a `publicchannels` event
  */
class PubChannelsStruct {
  /**
    * @param {Array} list Array of objects containing channel name and population
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
      * Array of objects containing channel name and population
      * @type {array}
      */
    this.list = data.list;

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
    return this.list.join(', ');
  }
}

export default PubChannelsStruct;
