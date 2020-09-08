const AbstractEvent = require('./AbstractEvent');
const ClientStruct = require('../structures/ClientStruct');
const UserStruct = require('../structures/UserStruct');

/**
  * This class handles an incoming `onlineSet` event from the server
  * @todo Change user handling for multi-channel patch. What if we removed
  * this event entirely and funneled everything through the `join` event?
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

    /**
      * Patch user array into online users
      * @todo This will be changed with the multi-channel patch
      * @legacy
      */
    data.users.map((userData) => {
      if (userData.isme) {
        if (!client.myUser) {
          client.myUser = new ClientStruct(client, userData);
        }
      }

      return client.users.set(userData.userid, new UserStruct(client, userData));
    });
  }
}

module.exports = OnlineSet;
