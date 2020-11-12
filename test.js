/* eslint no-console: 0 */
import Client from './Client.js';

const testName = 'testBot';
const testPass = 'testBot';
const testChannel = 'programming';

const hcClient = new Client({
  ws: {
    gateway: 'ws://127.0.0.1:6060/',
  },
  debug: true,
});

hcClient.on('connected', () => console.log('Connected!'));

hcClient.on('session', (payload) => {
  console.log(payload);
  hcClient.join(testName, testPass, testChannel);
});

hcClient.on('channelJoined', (payload) => {
  console.log(payload);
  hcClient.say(testChannel, 'Bep boop i r bot');
});

hcClient.on('debug', (payload) => console.log(payload));

hcClient.on('userJoined', (payload) => console.log(payload));

hcClient.on('userLeft', (payload) => console.log(payload));

hcClient.on('warning', (payload) => console.log(payload));

hcClient.on('gotCaptcha', (payload) => console.log(payload));

hcClient.on('information', (payload) => console.log(payload));

hcClient.on('emote', (payload) => console.log(payload));

hcClient.on('invite', (payload) => console.log(payload));

hcClient.on('whisper', (payload) => console.log(payload));

hcClient.on('message', (payload) => console.log(payload));
