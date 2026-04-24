import AbstractEvent from './AbstractEvent.js';
import ClientStruct from '../structures/ClientStruct.js';
import UserStruct from '../structures/UserStruct.js';

/**
  * This class handles an incoming `onlineSet` event from the server
  * @private
  */
class OnlineSet extends AbstractEvent {
  /**
    * Event handler function
    * @param {object} data Incoming event data
    * @returns {void}
    */
  handle(data) {
    const { client } = this;
    const incomingChannel = data.channel;

    data.users.forEach((userData) => {
      if (userData.isme) {
        if (!client.myUser) {
          // eslint-disable-next-line no-param-reassign
          userData.channel = incomingChannel;
          client.myUser = new ClientStruct(client, userData);
        } else {
          if (client.myUser.channels) {
            client.myUser.channels.add(incomingChannel);
          }

          client.myUser.updateUser(userData);
        }
      }

      const existingUser = client.users.get(userData.userid);

      if (existingUser) {
        if (existingUser.channels) {
          existingUser.channels.add(incomingChannel);
        }

        existingUser.updateUser(userData);
        existingUser.online = true;
      } else {
        // eslint-disable-next-line no-param-reassign
        userData.channel = incomingChannel;

        const newUser = new UserStruct(client, userData);
        client.users.set(userData.userid, newUser);
      }
    });
  }
}

export default OnlineSet;
