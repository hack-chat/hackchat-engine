const AbstractEvent = require('./AbstractEvent');
const CaptchaStruct = require('../structures/CaptchaStruct');

/**
  * This class handles an incoming `captcha` event from the server
  * @private
  */
class Captcha extends AbstractEvent {
  /**
    * Event handler function
    * @param {object} data Incoming event data
    * @returns {object}
    */
  handle(data) {
    const captchaData = new CaptchaStruct(this.client, data);

    return {
      captchaData,
    };
  }
}

module.exports = Captcha;
