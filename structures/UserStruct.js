import { OPCodes } from '../util/Constants.js';

/**
  * This class handles parsing of the data of a user and
  * provides helper functions to work with that user
  */
class User {
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
      * This users id
      * @type {number}
      */
    this.userid = data.userid || -1;

    /**
      * This users channel
      * @type {string}
      * @legacy Will be array or set with multichannel patch
      */
    this.userchannel = data.channel || 'unknown';

    /**
      * This users name
      * @type {string}
      */
    this.username = data.nick || 'anonymous';

    /**
      * This users trip code
      * @type {string}
      */
    this.usertrip = data.trip || '';

    /**
      * This users connection fingerprint
      * @type {string}
      */
    this.userhash = data.hash || '';

    /**
      * This users uType (user, mod, admin)
      * @type {string}
      */
    this.userlevel = data.uType || 'user';

    /**
      * Whether this user is online or offline
      * @type {boolean}
      */
    this.online = true;

    /**
      * Whether or not the user is a bot
      * @todo
      * @type {boolean}
      */
    this.bot = data.isBot || false;

    /**
      * The Message object of the last message sent by the user, if one was sent
      * @type {Message}
      */
    this.lastMessage = {};

    /**
      * The Date when the user was first seen or last came online in the channel
      * @type {Date}
      */
    this.joined = new Date();

    /**
      * If blocked is true this client will ignore this user
      * @type {boolean}
      */
    this.blocked = false;

    /**
      * Is this the current users record
      * @type {boolean}
      */
    this.mine = data.isme || false;

    /**
      * User's color
      * @type {string}
      */
    this.nickColor = data.color || false;

    /**
      * User's color
      * @type {string}
      */
    this.flair = data.flair || '';

    /**
      * Numeric permission level
      * @type {number}
      */
    this.permissionLevel = data.level || false;
  }

  /**
    * User id
    * @type {number}
    * @readonly
    */
  get id() {
    return this.userid;
  }

  /**
    * User name
    * @type {string}
    * @readonly
    */
  get channel() {
    return this.userchannel;
  }

  /**
    * User name
    * @type {string}
    * @readonly
    */
  get name() {
    return this.username;
  }

  /**
    * User trip
    * @type {string}
    * @readonly
    */
  get trip() {
    return this.usertrip;
  }

  /**
    * User connection hash
    * @type {string}
    * @readonly
    */
  get hash() {
    return this.userHash;
  }

  /**
    * User level , returns 'user', 'mod', 'admin'
    * @type {number}
    * @todo Change from string to numeric levels
    * @readonly
    */
  get level() {
    return this.userlevel;
  }

  /**
    * Online status
    * @type {boolean}
    * @readonly
    */
  get isOnline() {
    return this.online;
  }

  /**
    * Bot status
    * @type {boolean}
    * @todo
    * @readonly
    */
  get isBot() {
    return this.bot;
  }

  /**
    * Last message sent by this user
    * @type {Message || null}
    * @readonly
    */
  get message() {
    return this.lastMessage;
  }

  /**
    * Date object of when the client last seen online
    * @type {Date}
    * @readonly
    */
  get dateJoined() {
    return this.joined;
  }

  /**
    * Is the client ignoring this user
    * @type {boolean}
    * @readonly
    */
  get isBlocked() {
    return this.blocked;
  }

  /**
    * Full mention tag; @Nick#trip or @Nick
    * @type {string}
    * @readonly
    */
  get tag() {
    return `@${this.username}${this.usertrip !== null ? `#${this.usertrip}` : ''}`;
  }

  /**
    * Is this the current connected client's user record
    * @type {boolean}
    * @readonly
    */
  get isMine() {
    return this.mine;
  }

  /**
    * User's color
    * @type {string}
    * @readonly
    */
  get color() {
    return this.nickColor;
  }

  /**
    * User's permission level
    * @type {string}
    * @readonly
    */
  get perms() {
    return this.permissionLevel;
  }

  /**
    * Patch new user info sent from server
    * @param {object} data User object sent from server
    * @type {string}
    */
  updateUser(data) {
    this.username = data.nick;
    this.userlevel = data.uType;
    this.bot = data.isBot;
    this.nickColor = data.color;
    this.flair = data.flair;
    this.permissionLevel = data.level;
  }

  /**
    * Sets this user either online or offline
    * @param {string} channel Channel that the user joined or left
    * @returns {boolean}
    */
  // @todo Multichannel
  toggleOnline(channel) { // eslint-disable-line no-unused-vars
    this.online = !this.online;
    return this.online;
  }

  /**
    * Sets this user either online or offline
    * @param {Message} message This user's latest message
    * @returns {Message}
    */
  setLastMessage(message) {
    this.lastMessage = message;
    return this.lastMessage;
  }

  /**
    * Toggle this users blocked flag
    * @returns {boolean}
    */
  toggleBlock() {
    this.blocked = !this.blocked;
    return this.blocked;
  }

  /**
    * Send chat text using this user's channel
    * @param {string} text Text to send
    * @returns {boolean}
    */
  sendMessage(text) {
    try {
      return new Promise((resolve) => {
        this.client.ws.send({
          cmd: OPCodes.CHAT,
          channel: this.channel, // @todo Multichannel
          text,
        });
        resolve(this);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
    * Send a whisper through this users channel to the user
    * @param {string} text Text to send
    * @todo Finish whisper functions on server
    * @returns {Promise}
    */
  sendWhisper(text) {
    try {
      return new Promise((resolve) => {
        this.client.ws.send({
          cmd: OPCodes.WHISPER,
          channel: this.channel, // @todo Multichannel
          userid: this.userid,
          text,
        });
        resolve(this);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
    * Send `invite` event to this user
    * @returns {void}
    */
  sendInvite(channel, to = '') {
    let toChannel = to;
    if (toChannel === '') {
      toChannel = Math.random().toString(36).substring(2, 15);
    }

    return this.client.ws.send({
      cmd: OPCodes.INVITE,
      userid: this.userid,
      channel,
      to: toChannel,
    });
  }

  /**
    * Send `kick` operation to the server
    * @returns {void}
    */
  kick(channel, to = '') {
    let toChannel = to;
    if (toChannel === '') {
      toChannel = Math.random().toString(36).substring(2, 15);
    }

    this.client.ws.send({
      cmd: OPCodes.KICK,
      userid: this.userid,
      channel,
      to: toChannel,
    });
  }

  /**
    * Send `ban` operation to the server
    * @returns {void}
    */
  ban(channel) {
    this.client.ws.send({
      cmd: OPCodes.BAN,
      userid: this.userid,
      channel,
    });
  }

  /**
    * Send `mute` operation to the server
    * @returns {void}
    */
  mute(channel) {
    this.client.ws.send({
      cmd: OPCodes.MUTE,
      userid: this.userid,
      channel,
    });
  }

  /**
    * Send `unmute` operation to the server
    * @returns {void}
    */
  unmute(channel) {
    this.client.ws.send({
      cmd: OPCodes.UNMUTE,
      hash: this.userhash,
      channel,
    });
  }

  /**
    * When referenced as a string, output this users name instead of an object type
    * @returns {string}
    */
  toString() {
    return `@${this.username}`;
  }
}

export default User;
