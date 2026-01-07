/**
  * This class handles parsing of the data of a `walletInfo` event
  */
class WalletInfoStruct {
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
      * The channel where the request originated
      * @type {string}
      */
    this.channel = data.channel;

    /**
      * The user ID of the target user
      * @type {number}
      */
    this.userid = data.userid;

    /**
      * The nickname of the target user
      * @type {string}
      */
    this.nick = data.nick;

    /**
      * The public wallet address of the user
      * @type {string}
      */
    this.address = data.address;

    /**
      * The user object associated with this wallet info
      * @type {User|undefined}
      */
    this.user = this.client.users.get(data.userid);
  }
}

export default WalletInfoStruct;
