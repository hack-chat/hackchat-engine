const AbstractHandler = require('./AbstractHandler');
const { Events } = require('../../../util/Constants');

/**
  * Handles an invite packet received from the server
  * @private
  */
class InviteHandler extends AbstractHandler {
  /**
    * Parses incoming packet data and emits related events
    * @param {object} packet Incoming packet data
    * @returns {void}
    */
  handle(packet) {
    const { client } = this.packetRouter;
    const response = client.events.Invite.handle(packet);

    /**
      * Emitted when the client recives an invite packet
      * @event Client#invite
      * @param {Invite} message The created message
      */
    client.emit(Events.CHANNEL_INVITE, response.message);
  }
}

module.exports = InviteHandler;
