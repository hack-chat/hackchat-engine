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

** Need to update this **
