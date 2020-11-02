/**
  * This class handles parsing of the data of an `info` event
  */
class Information {
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
      * Informational text
      * @type {string}
      */
    this.text = data.text;

    /**
      * The channel the event occured in
      * @type {string}
      */
    this.channel = data.channel;
  }
}

export default Information;
