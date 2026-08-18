import AbstractHandler from './AbstractHandler.js';
import { Events, Status } from '../../../util/Constants.js';

/**
  * Handles a new chat message that has been broadcast within a channel
  * @private
  */
class SessionHandler extends AbstractHandler {
  /**
    * Parses incoming packet data and emits related events
    * @param {object} packet Incoming packet data
    * @returns {void}
    */
  handle(packet) {
    const { client } = this.packetRouter;

    client.readyAt = new Date();

    if (client.status !== Status.READY) {
      const t = client.setTimeout(() => {
        client.ws.connection.triggerReady();
      }, 1);

      client.once(Events.READY, () => {
        client.clearTimeout(t);
      });
    }

    const response = client.events.Session.handle(packet);

    /**
      * Emitted when a session packet is received
      * @event Client#session
      * @param {SessionStruct} session Full session details
      */
    client.emit(Events.SESSION, response.session);

    // Emit debug info
    client.emit(Events.DEBUG, `[${Events.SESSION}]: ${packet}`);
  }
}

export default SessionHandler;
