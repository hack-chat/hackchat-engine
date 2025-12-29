import AbstractHandler from './AbstractHandler.js';
import { Events } from '../../../util/Constants.js';

/**
  * Handles an incoming custom `signTransaction` event from the server
  * @private
  */
class SignTransactionHandler extends AbstractHandler {
  /**
    * Parses incoming packet data and emits related events
    * @param {object} packet Incoming packet data
    * @returns {void}
    */
  handle(packet) {
    const { client } = this.packetRouter;

    /**
      * Emitted when the server requests the client to sign a transaction
      * @event Client#signTransaction
      * @param {object} payload The payload containing the tx and type
      * @param {string} payload.tx The base64 encoded transaction payload
      * @param {string} payload.type The transaction type
      * @param {string} payload.channel The channel which invoked the event
      */
    client.emit(Events.SIGN_TRANSACTION, {
      tx: packet.tx,
      type: packet.type,
      channel: packet.channel,
      from: packet.from,
    });

    client.emit(Events.DEBUG, `[${Events.SIGN_TRANSACTION}]: signTransaction requested`);
  }
}

export default SignTransactionHandler;
