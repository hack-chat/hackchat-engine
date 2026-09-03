/**
  * This class handles parsing of the data of a `passwordreq` event
  */
class PasswordReqStruct {
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
      * The channel the password request occurred in
      * @type {string}
      */
    this.channel = data.channel;
  }
}

export default PasswordReqStruct;
