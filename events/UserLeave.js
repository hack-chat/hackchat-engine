import AbstractEvent from './AbstractEvent.js';
import { Events } from '../util/Constants.js';

/**
  * This class handles an incoming `leave` event from the server
  * @private
  */
class UserLeave extends AbstractEvent {
  /**
    * Event handler function
    * @param {object} data Incoming event data
    * @returns {object}
    */
  handle(data) {
    const { client } = this;
    const user = client.users.get(data.userid);

    if (user) {
      user.channels.delete(data.channel);

      if (user.channels.size === 0) {
        user.online = false;
        user.userEffect = 0;

        client.emit(Events.USER_UPDATE, user);
      }
    }

    return user;
  }
}

export default UserLeave;
