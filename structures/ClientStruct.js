import User from './UserStruct.js';
import { OPCodes } from '../util/Constants.js';

/**
  * Extends UserStruct class adding properties and functions unique
  * to the currently connected client
  * @extends {User}
  */
class ClientStruct extends User {
  /**
    * Fill in this structure with provided data
    * @param {object} data Incoming event data
    * @returns {void}
    */
  setup(client, data) {
    super.setup(client, data);
  }

  /**
    * Globally block new data from a target user id
    * @param {number} id Target user id to block
    * @returns {void}
    * @example
    * // Block a user:
    * client.user.block(userid);
    */
  blockUser(id) {
    const user = this.client.users.get(id);

    if (user && !user.isBlocked) {
      user.toggleBlock();
    }
  }

  /**
    * Changes the name of the client on all channels
    * @param {string} username The new username
    * @returns {void}
    * @example
    * // Changing the clients username:
    * client.user.setUsername('NewNick');
    */
  changeUsername(username) {
    const payload = {
      cmd: OPCodes.CHANGE_NICK,
      nick: username,
    };

    this.client.ws.send(payload);
  }
}

export default ClientStruct;
