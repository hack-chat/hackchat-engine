# hackchat-engine

A NodeJS and browser friendly JavaScript library used to interact with a hackchat server.

# Installation

## Prerequisites

- [node.js 14.15](https://nodejs.org/en/download/package-manager/) or higher
- [npm 6](https://nodejs.org/en/download/package-manager/) or higher

## Install

`npm i hackchat-engine`

# Usage

## Minimum Usage

```javascript
  const { Client } = require('hackchat-engine');
  const hcClient = new Client();

  const testName = 'testBot';
  const testPass = 'testBot';
  const testChannel = 'programming';

  hcClient.on('connected', () => console.log('Connected!'));

  hcClient.on('session', (payload) => {
    console.log(payload);
    hcClient.join(testName, testPass, testChannel);
  });

  hcClient.on('channelJoined', (payload) => {
    console.log(payload);
    hcClient.say(testChannel, 'Bep boop i r bot');
  });

  hcClient.on('message', (payload) => {
    console.log(payload);
    hcClient.say(testChannel, 'No u');
  });
```

## Advanced Usage

** Need to update this, still **

### Changing the connection

By default, this engine will connect to 'wss://hack.chat/chat-ws'. To change this, add a `ws.gateway` property to the `options` object, for example:

```javascript
const hcClient = new Client({
  ws: {
    gateway: 'ws://1.1.1.1:6060/',
  }
});
```
