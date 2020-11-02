/**
  * This class handles parsing of the data of an `invite` event
  */
class Invite {
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
      * The user who initiated the invite
      * @type {User}
      */
    this.from = this.client.users.find((val) => val.userid === data.from);

    /**
      * Invite was sent by this client
      * @type {boolean}
      */
    this.fromMe = false;
    if (data.from === this.client.myUser.userid) {
      this.fromMe = true;
    }

    /**
      * The user who got the invite
      * @type {User}
      */
    this.to = this.client.users.find((val) => val.userid === data.to);

    /**
      * Mutually invited channel
      * @type {string}
      */
    this.targetChannel = data.inviteChannel;

    /**
      * The channel the event occured in
      * @type {string}
      */
    this.channel = data.channel;
  }
}

export default Invite;
