import AbstractEvent from './AbstractEvent.js';
import User from '../structures/UserStruct.js';

/**
  * This class handles an incoming `user update` event from the server
  * @private
  */
class UpdateUser extends AbstractEvent {
  /**
    * Event handler function
    * @param {object} data Incoming event data
    * @returns {object}
    */
  handle(data) {
    const { client } = this;
    let user = client.users.get(data.userid);

    let targetUser = null;

    if (!user) {
      user = new User(client, data);
      client.users.set(data.userid, user);
      targetUser = user;
    } else {
      user.updateUser(data);
      targetUser = user;
    }

    if (client.myUser && client.myUser.userid === data.userid) {
      client.myUser.updateUser(data);
      targetUser = client.myUser;
    }

    return targetUser;
  }
}

export default UpdateUser;
