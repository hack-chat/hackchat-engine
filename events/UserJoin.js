import AbstractEvent from './AbstractEvent.js';
import User from '../structures/UserStruct.js';

/**
  * This class handles an incoming `join` event from the server
  * @private
  */
class UserJoin extends AbstractEvent {
  /**
    * Event handler function
    * @param {object} data Incoming event data
    * @returns {object}
    */
  handle(data) {
    const { client } = this;
    const user = client.users.get(data.userid);

    if (user) {
      user.channels.add(data.channel);
      user.online = true;
      user.channel = data.channel;
      return user;
    }

    const newUser = new User(client, data);
    newUser.channel = data.channel;
    client.users.set(data.userid, newUser);
    return newUser;
  }
}

export default UserJoin;
