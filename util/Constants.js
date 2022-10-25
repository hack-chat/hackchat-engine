/**
  * Default client options
  * @typedef {object} DefaultOptions
  * @property {array} [ignoredEvents] Optional array of Constants.Events types to ignore
  * @property {object} [ws] Websocket connection details
  * @property {object} [http] Browser only http path definitions
  * @property {boolean} [isBot] Declare if this client is a bot or not
  */
export const DefaultOptions = {
  ignoredEvents: [],
  restTimeOffset: 500,

  /**
    * Default websocket options
    * @typedef {object} ws
    * @property {string} [gateway] Default websocket connection path
    */
  ws: {
    gateway: 'wss://hack.chat/chat-ws',
  },

  /**
    * Browser only http paths
    * @typedef {object} http
    * @property {string} [configPath] Browser only request for config
    */
  http: {
    configPath: 'config.json',
  },

  isBot: true,
  session: false,
};

/**
  * Typical client errors
  * @typedef {string} Errors
  */
export const Errors = {
  TOOK_TOO_LONG: 'Getting ready took too long. . .',
  INVALID_NAME: 'Nickname must consist of up to 24 letters, numbers, and underscores',
  INVALID_CHANNEL: 'Invalid channel',
};

/**
  * Current client connection phase
  * @typedef {number} Status
  */
export const Status = {
  READY: 0,
  CONNECTING: 1,
  IDLE: 2,
  DISCONNECTED: 3,
};

/**
  * Remote operations to execute through the websocket
  * @typedef {string} OPCodes
  */
export const OPCodes = {
  SESSION: 'session',
  JOIN: 'join',
  CHAT: 'chat',
  INVITE: 'invite',
  CHANGE_NICK: 'changenick',
  KICK: 'kick',
  BAN: 'ban',
  MUTE: 'muzzle',
  UNMUTE: 'unmuzzle',
  ENABLE_CAPTCHA: 'enablecaptcha',
  DISABLE_CAPTCHA: 'disablecaptcha',
  LOCK_ROOM: 'lockroom',
  UNLOCK_ROOM: 'unlockroom',
  WHISPER: 'whisper',
};

/**
  * Emitted client event names
  * @typedef {string} Events
  */
export const Events = {
  CONNECTED: 'connected',
  SESSION: 'session',
  NEW_MESSAGE: 'message',
  CHANNEL_INFO: 'information',
  CHANNEL_WARN: 'warning',
  ONLINE_SET: 'channelJoined',
  USER_JOIN: 'userJoined',
  USER_LEAVE: 'userLeft',
  USER_UPDATE: 'userUpdate',
  CHANNEL_CAPTCHA: 'gotCaptcha',
  RECONNECT: 'reconnect',
  CHANNEL_EMOTE: 'emote',
  CHANNEL_INVITE: 'invite',
  CHANNEL_WHISPER: 'whisper',
  READY: 'ready',
  DISCONNECT: 'disconnect',
  RECONNECTING: 'reconnecting',
  ERROR: 'error',
  WARN: 'warn',
  DEBUG: 'debug',
};

/**
  * Incoming websocket events
  * @typedef {string} WSEventType
  */
export const WSEvents = {
  SESSION: 'session',
  NEW_MESSAGE: 'chat',
  CHANNEL_INFO: 'info',
  CHANNEL_EMOTE: 'emote',
  CHANNEL_WARN: 'warn',
  ONLINE_SET: 'onlineSet',
  USER_JOIN: 'onlineAdd',
  USER_LEAVE: 'onlineRemove',
  USER_UPDATE: 'updateUser',
  CHANNEL_CAPTCHA: 'captcha',
  CHANNEL_INVITE: 'invite',
  CHANNEL_WHISPER: 'whisper',
};
