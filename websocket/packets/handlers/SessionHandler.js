import AbstractHandler from './AbstractHandler.js';
import { Events } from '../../../util/Constants.js';

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
    const t = client.setTimeout(() => {
      client.ws.connection.triggerReady();
    }, 1);

    client.once('ready', () => {
      client.setMaxListeners(10);
      client.clearTimeout(t);
    });

    const response = client.events.Session.handle(packet);

    /**
      * Emitted when a message is sent in a channel
      * @event Client#session
      * @param {SessionStruct} session Full session details
      */
    client.emit(Events.SESSION, response.session);

    // Emit debug info
    client.emit(Events.DEBUG, `[${Events.SESSION}]: ${packet}`);
  }
}

export default SessionHandler;
