/**
  * This class handles parsing of the data of a `warning` event
  * @todo Warnings will be numeric events in the future
  */
class WarningStruct {
  /**
    * @param {Client} client Main client reference
    * @param {object} data Incoming event data
    */
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
      * Numeric reason for the warning
      * @type {number}
      */
    this.id = data.id || 0;

    /**
      * Text included with warning
      * @todo Common warnings will be made integer based to allow i18n
      * This will be removed
      * @legacy
      * @type {string}
      */
    this.text = data.text;

    /**
      * Channel the warning was issued from
      * @todo Touches multi-channel patch
      * @type {string}
      */
    this.channel = data.channel;
  }
}

export default WarningStruct;
