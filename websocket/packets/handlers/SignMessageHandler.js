import AbstractHandler from './AbstractHandler.js';
import { Events } from '../../../util/Constants.js';

/**
  * Handles an incoming custom `signMessage` event from the server
  * @private
  */
class SignMessageHandler extends AbstractHandler {
  /**
    * Parses incoming packet data and emits related events
    * @param {object} packet Incoming packet data
    * @returns {void}
    */
  handle(packet) {
    const { client } = this.packetRouter;

    /**
      * Emitted when the server requests the client to sign a message
      * This is used for Sign-In with Solana (SIWS) authentication
      * @event Client#signMessage
      * @param {object} payload The payload containing the wallet and message
      * @param {string} payload.wallet The public key of the wallet to sign with
      * @param {string} payload.message The human-readable message to be signed
      */
    client.emit(Events.SIGN_MESSAGE, {
      wallet: packet.wallet,
      message: packet.message,
    });

    client.emit(Events.DEBUG, `[${Events.SIGN_MESSAGE}]: Request received for wallet ${packet.wallet}`);
  }
}

export default SignMessageHandler;
