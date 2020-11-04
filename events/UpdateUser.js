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

    user.updateUser(data);

    return user;
  }
}

export default UpdateUser;
