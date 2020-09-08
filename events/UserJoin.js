const AbstractEvent = require('./AbstractEvent');
const User = require('../structures/UserStruct');

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
    // Check if user is already stored
    const user = client.users.get(data.userid);

    // If stored, set them to online
    if (user) {
      user.toggleOnline();
      return user;
    }

    // If not, then add them to the records
    const newUser = new User(client, data);
    client.users.set(data.userid, newUser);
    return newUser;
  }
}

module.exports = UserJoin;
