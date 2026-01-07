import AbstractHandler from './AbstractHandler.js';
import { Events } from '../../../util/Constants.js';

/**
  * Handles a walletInfo packet received from the server
  * @private
  */
class WalletInfoHandler extends AbstractHandler {
  /**
    * Parses incoming packet data and emits related events
    * @param {object} packet Incoming packet data
    * @returns {void}
    */
  handle(packet) {
    const { client } = this.packetRouter;
    const response = client.events.WalletInfo.handle(packet);

    /**
      * Emitted when wallet information is received
      * @event Client#walletInfo
      * @param {WalletInfoStruct} info The wallet information
      */
    client.emit(Events.WALLET_INFO, response.info);

    // Emit debug info
    client.emit(Events.DEBUG, `[${Events.WALLET_INFO}]: ${packet}`);
  }
}

export default WalletInfoHandler;
