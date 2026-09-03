import AbstractEvent from './AbstractEvent.js';
import PasswordReqStruct from '../structures/PasswordReqStruct.js';

/**
  * This class handles an incoming `passwordreq` event from the server
  * @private
  */
class PasswordReq extends AbstractEvent {
  /**
    * Event handler function
    * @param {object} data Incoming event data
    * @returns {object}
    */
  handle(data) {
    const passwordReqData = new PasswordReqStruct(this.client, data);

    return {
      passwordReqData,
    };
  }
}

export default PasswordReq;
