import AbstractHandler from './AbstractHandler.js';
import { Events } from '../../../util/Constants.js';

/**
  * Handles the data sent when joining a channel
  * @private
  */
class OnlineSetHandler extends AbstractHandler {
  /**
    * Parses incoming packet data and emits related events
    * @param {object} packet Incoming packet data
    * @returns {void}
    */
  handle(packet) {
    const { client } = this.packetRouter;

    client.events.OnlineSet.handle(packet);

    /**
      * Emitted when a newly joined channel's userlist has been received
      * @event Client#channelJoined
      * @param {Client} client The main client
      */
    client.emit(Events.ONLINE_SET, {
      client,
      channel: packet.channel,
    });

    // Emit debug info
    client.emit(Events.DEBUG, `[${Events.ONLINE_SET}]: ${packet}`);
  }
}

export default OnlineSetHandler;
