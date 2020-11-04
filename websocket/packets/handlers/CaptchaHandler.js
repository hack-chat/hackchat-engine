import AbstractHandler from './AbstractHandler.js';
import { Events } from '../../../util/Constants.js';

/**
  * Handles a captcha received while attempting to join a channel
  * @private
  */
class CaptchaHandler extends AbstractHandler {
  /**
    * Parses incoming packet data and emits related events
    * @param {object} packet Incoming packet data
    * @returns {void}
    */
  handle(packet) {
    const { client } = this.packetRouter;
    const response = client.events.Captcha.handle(packet);

    /**
      * Emitted when a captcha is encountered
      * @event Client#gotCaptcha
      * @param {Captcha} captcha The captcha data
      */
    client.emit(Events.CHANNEL_CAPTCHA, response);

    // Emit debug info
    client.emit(Events.DEBUG, `[${Events.CHANNEL_CAPTCHA}]: ${packet}`);
  }
}

export default CaptchaHandler;
