import AbstractEvent from './AbstractEvent.js';
import WalletInfoStruct from '../structures/WalletInfoStruct.js';

/**
  * This class handles an incoming `walletInfo` event from the server
  * @private
  */
class WalletInfo extends AbstractEvent {
  /**
    * Event handler function
    * @param {object} data Incoming event data
    * @returns {object}
    */
  handle(data) {
    const { client } = this;
    const info = new WalletInfoStruct(client, data);

    return {
      info,
    };
  }
}

export default WalletInfo;
