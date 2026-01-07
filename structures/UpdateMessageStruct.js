/**
  * This class handles parsing of the data of an `updateMessage` event
  */
class UpdateMessageStruct {
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

    if (data) this.setup(data);
  }

  /**
    * Fill in this structure with provided data
    * @param {object} data Incoming event data
    * @returns {void}
    */
  setup(data) {
    /**
      * The channel the message resides in
      * @type {string}
      */
    this.channel = data.channel;

    /**
      * The customId of the target message
      * @type {string}
      */
    this.customId = data.customId;

    /**
      * The update mode (overwrite, append, prepend, complete)
      * @type {string}
      */
    this.mode = data.mode;

    /**
      * The new text content (or text to append/prepend)
      * @type {string}
      */
    this.text = data.text;

    /**
      * The user who initiated the update
      * @type {User}
      */
    this.user = this.client.users.get(data.userid);

    /**
      * The timestamp of the update
      * @type {Date}
      */
    this.timestamp = new Date();
  }
}

export default UpdateMessageStruct;
