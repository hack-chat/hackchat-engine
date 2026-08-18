import AbstractEvent from './AbstractEvent.js';

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
    const user = client.users.get(data.userid);

    if (user) {
      user.updateUser(data);
    }

    if (client.myUser && client.myUser.userid === data.userid) {
      client.myUser.updateUser(data);
    }

    return user;
  }
}

export default UpdateUser;
