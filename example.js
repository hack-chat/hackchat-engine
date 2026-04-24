/* eslint-disable no-console */

// remember to npm install hackchat-engine
// import { Client, Events } from 'hackchat-engine'; <-- use this one
// import { Client as HcClient, Events as HcEvents } from 'hackchat-engine'; <-- or this one
import { Client, Events } from './index.js'; // <-- not this one

const CONFIG = {
  gateway: 'wss://hack.chat/chat-ws',
  botName: 'ExampleBot',
  password: 'botpassword',
  homeChannel: 'test',
};

// init
let sessionToken = null;

const client = new Client({
  ws: { gateway: CONFIG.gateway },
  debug: false, // set to true to see internal debug logs
  session: sessionToken,
});

console.log(`Starting ${CONFIG.botName}`);

/**
  * 1. Connection & session events
  */

/**
  * Fired when the WebSocket successfully opens
  */
client.on(Events.CONNECTED, () => {
  console.log('[Connection] WebSocket connected. Negotiating session...');
});

/**
  * Fired when the server provides a session token
  * This is the "login success" event
  */
client.on(Events.SESSION, (payload) => {
  if (payload.token) {
    sessionToken = payload.token;
    console.log(`[Session] Token received: ${payload.token.substring(0, 10)}...`);
  }

  // join the home channel once we have a session
  console.log(`[System] Joining ${CONFIG.homeChannel}...`);
  client.join(CONFIG.botName, CONFIG.password, CONFIG.homeChannel);
});

/**
  * Fired when the client is fully ready
  */
client.on(Events.READY, () => {
  console.log('[System] Client is Ready');
});

/**
  * Fired when the socket disconnects
  */
client.on(Events.DISCONNECT, (event) => {
  console.log(`[Connection] Disconnected. Code: ${event.code}`);
});

/**
  * Fired when the client attempts to auto-reconnect
  */
client.on(Events.RECONNECTING, () => {
  console.log('[Connection] Connection lost. Attempting to reconnect...');
});

/**
  * 2. Channel & user state events
  */

/**
  * Fired when the client successfully joins a channel
  * Contains the channel name and the initial list of users
  */
client.on(Events.ONLINE_SET, (payload) => {
  console.log(`[Channel] Joined '${payload.channel}'. Users: ${payload.users.length}`);

  // optional: announce arrival
  client.say(payload.channel, `Hello! I am ${CONFIG.botName}.`);
});

/**
  * Fired when a user joins a channel
  */
client.on(Events.USER_JOIN, (user) => {
  console.log(`[Presence] ${user.username} joined ${user.channel}.`);
});

/**
  * Fired when a user leaves a channel
  */
client.on(Events.USER_LEAVE, (user) => {
  console.log(`[Presence] ${user.username} left ${user.channel}.`);
});

/**
  * Fired when a user updates their details (change nick, color, trip, etc)
  */
client.on(Events.USER_UPDATE, (user) => {
  console.log(`[Presence] User updated: ${user.username} (Trip: ${user.trip || 'None'})`);
});

/**
  * Fired when the server sends the list of public channels
  */
client.on(Events.PUB_CHANS, (payload) => {
  console.log(`[Info] Received public channel list: ${payload.list.length} channels.`);
});

/**
  * Fired when the server sends an informational message
  */
client.on(Events.CHANNEL_INFO, (info) => {
  console.log(`[Info] Server sez: "${info.text}" in ${info.channel}`);
});

/**
  * 3. Chat & interaction events
  */

/**
  * Fired on standard chat messages
  */
client.on(Events.NEW_MESSAGE, (msg) => {
  // ignore our own messages
  if (msg.user.username === CONFIG.botName) return;

  console.log(`[Chat][${msg.channel}] ${msg.user.username}: ${msg.content}`);

  // example command handling
  if (msg.content === '!ping') {
    client.say(msg.channel, `@${msg.user.username} Pong!`);
  }
});

/**
  * Fired when a user performs an emote
  */
client.on(Events.CHANNEL_EMOTE, (emote) => {
  console.log(`[Emote][${emote.channel}]  * ${emote.user.username} ${emote.content}`);
});

/**
  * Fired when the bot receives a private whisper
  */
client.on(Events.CHANNEL_WHISPER, (msg) => {
  console.log(`[Whisper] ${msg.from.username} -> Me: ${msg.content}`);

  // auto-reply example
  msg.reply(`I received your whisper: "${msg.content}"`);
});

/**
  * Fired when the bot is invited to another channel
  */
client.on(Events.CHANNEL_INVITE, (invite) => {
  console.log(`[Invite] ${invite.from.username} invited us to '${invite.targetChannel}'`);
  // client.join(CONFIG.botName, CONFIG.password, invite.targetChannel);
});

/**
  * Fired when a message is edited/updated (e.g. overwriting the last line)
  */
client.on(Events.UPDATE_MESSAGE, (update) => {
  console.log(`[Edit] ${update.user.username} updated a message in ${update.channel}. Mode: ${update.mode}`);
});

/**
  * 4. Security & system events
  */

/**
  * Fired when the server issues a warning (e.g., spamming too fast)
  */
client.on(Events.CHANNEL_WARN, (warning) => {
  console.warn(`[Warning] ID: ${warning.id} | Text: ${warning.text}`);
});

/**
  * Fired when the server requires a CAPTCHA to join/chat
  */
client.on(Events.CHANNEL_CAPTCHA, (captcha) => {
  console.log(`[Captcha] Captcha required in ${captcha.channel}`);
  console.log(captcha.text); // prints the ascii art
});

/**
  * Fired when a 3rd party code suggestion arrives
  */
client.on(Events.HACK_ATTEMPT, (suggestion) => {
  console.warn(`[Extension] 3rd party code suggested from ${suggestion.fromNick}, library: ${suggestion.lib}`);
});

/**
  * Fired on internal errors
  */
client.on(Events.ERROR, (err) => {
  console.error('[Error]', err);
});

/**
  * Fired on non-critical internal warnings
  */
client.on(Events.WARN, (msg) => {
  console.warn('[System Warn]', msg);
});

/**
  * Fired for debug logs (if debug: true is set in Client options)
  * Uncomment to see verbose logs
  */
/*
client.on(Events.DEBUG, (msg) => {
  console.log('[Debug]', msg);
});
*/

/**
  * 5. Web3 / wallet events
  */

/**
  * Fired when a wallet address lookup (getWallet) returns data
  */
client.on(Events.WALLET_INFO, (info) => {
  console.log(`[Wallet] User: ${info.nick}, Address: ${info.address}`);
});

/**
  * Fired when the server requests the client to Sign-In With Solana (SIWS)
  */
client.on(Events.SIGN_MESSAGE, (payload) => {
  console.log(`[Web3] Sign Message Request. Wallet: ${payload.wallet}`);
  console.log(`[Web3] Message to sign: "${payload.message}"`);
  // logic to sign message with private key would go here
  // @todo show reply flow
});

/**
  * Fired when the server requests the client to sign a transaction
  */
client.on(Events.SIGN_TRANSACTION, (payload) => {
  console.log(`[Web3] Sign Transaction Request. Type: ${payload.type}`);
  console.log(`[Web3] TX Payload: ${payload.tx.substring(0, 20)}...`);
  // @todo show reply flow
});

/**
  * Process cleanup
  */
process.on('SIGINT', () => {
  console.log('\n[System] Disconnecting...');
  client.destroy();
  process.exit(0);
});
