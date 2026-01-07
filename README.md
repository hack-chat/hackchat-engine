# hackchat-engine

A modern, NodeJS and browser-friendly ES6 WebSocket library for interacting with [hack.chat](https://hack.chat) servers. This engine provides an object-oriented interface, automatic keep-alives, and structured event handling.

## Installation

### Prerequisites

* **Node.js 14+** (This package uses ES Modules)
* **NPM 6+**

### Install

```bash
npm install hackchat-engine

```

---

## Quick Start

This library uses **ES Modules**. You must use `import` syntax.

```javascript
import { Client } from 'hackchat-engine';

const botName = 'MyBot';
const botPass = 'secretPassword';
const channel = 'programming';

// Initialize the client
const client = new Client({
  debug: true
});

// Triggered when the WebSocket connects to the gateway
client.on('connected', () => {
  console.log('Connected to server!');
  client.ws.send({ cmd: 'getchannels' });
  client.join(botName, botPass, channel);
});

// Triggered when the server assigns a session ID
client.on('session', (session) => {
  console.log(`Session ID: ${session.sessionID}`);
});

// Triggered when the client successfully joins the channel
client.on('channelJoined', (data) => {
  console.log(`Joined channel: ${data.channel}`);
  client.say(channel, 'Hello world! I am a bot.');
});

// Triggered on every new message
client.on('message', (message) => {
  // Ignore our own messages
  if (message.user.isMine) return;

  console.log(`[${message.channel}] ${message.user.name}: ${message.content}`);

  if (message.content === '!ping') {
    // Helper method to reply directly to the channel
    message.reply('Pong!');
  }
});

```

---

## Configuration

You can pass an options object to the `Client` constructor to customize the connection.

```javascript
const client = new Client({
  // Connection details
  ws: {
    gateway: 'wss://hack.chat/chat-ws', // Default
    // gateway: 'ws://127.0.0.1:6060/' // For local development
  },
  
  // Set to true to see internal logs and raw packets
  debug: false, 

  // If true, identifies as a bot to the server (default: true)
  isBot: true, 
});

```

---

## Events

The client extends `EventEmitter`. You can listen for the following events:

| Event | Payload | Description |
| --- | --- | --- |
| `connected` | `Client` | Socket connection established. |
| `session` | `SessionStruct` | Server has assigned a session ID. |
| `channelJoined` | `Object` | Client has successfully joined a channel and received the user list. |
| `message` | `MessageStruct` | A new message was received. |
| `userJoined` | `UserStruct` | A user joined the channel. |
| `userLeft` | `UserStruct` | A user left the channel. |
| `userUpdate` | `UserStruct` | A user changed their flair, color, or status. |
| `whisper` | `WhisperStruct` | Received a private whisper. |
| `invite` | `InviteStruct` | Received an invitation to another channel. |
| `emote` | `EmoteStruct` | A user sent a `/me` emote. |
| `warning` | `WarningStruct` | Server sent a warning (e.g., rate limit). |
| `gotCaptcha` | `CaptchaStruct` | Server requires a captcha solution. |
| `hackAttempt` | `HackAttemptStruct` | A user attempted a disallowed action (admin alerts). |
| `updateMessage` | `UpdateMessageStruct` | A previously sent message was edited or deleted. |

---

## Key Methods

### Core

* **`client.join(nick, password, channel)`**: Authenticate and join a specific channel.
* **`client.say(channel, text)`**: Send a message to a channel.
* **`client.changeColor(hex)`**: Change your nickname color (e.g., `CCCCCC`).
* **`client.changeUsername(newNick)`**: Request a nickname change.

### Moderation

* **`client.kick(channel, user)`**: Kick a user (requires permissions).
* **`client.ban(channel, user)`**: Ban a user (requires permissions).
* **`client.enableCaptcha(channel)`**: Turn on captcha for the channel.
* **`client.lockChannel(channel)`**: Lock the channel (admin only).

### Interactions

The `MessageStruct` (passed in the `message` event) has helper methods:

* **`message.reply(text)`**: Automatically replies to the channel the message originated from.

### Message Manipulation

* **`client.updateMessage(customId, text, mode)`**: Edit a message you previously sent.
* `mode`: `'overwrite'`, `'append'`, `'prepend'`, or `'complete'` (delete).



---

## Advanced Usage

### Handling Custom Commands

If the server implements custom opcodes that are not natively handled by the engine, you can register a listener for them:

```javascript
client.onCommand('customEvent', (payload) => {
  console.log('Received custom packet:', payload);
});

```

### Accessing Users

Users are stored in an extended Map for easy access.

```javascript
// Get a user by ID
const user = client.users.get(12345);

// Find a user by name
const user = client.users.find(u => u.username === 'Admin');

if (user) {
  console.log(`${user.username} is currently ${user.isOnline ? 'Online' : 'Offline'}`);
}

```

## License

MIT
