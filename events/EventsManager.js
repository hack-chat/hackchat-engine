/* eslint global-require: 0 */

/**
  * This class routes incoming event data to it's proper handler
  * @private
  */
class EventsManager {
  /**
    * @param {Client} client Main client reference
    */
  constructor(client) {
    this.client = client;

    this.register(require('./Session'));
    this.register(require('./Captcha'));
    this.register(require('./Chat'));
    this.register(require('./Info'));
    this.register(require('./Emote'));
    this.register(require('./Invite'));
    this.register(require('./OnlineSet'));
    this.register(require('./UserJoin'));
    this.register(require('./UserLeave'));
    this.register(require('./Warning'));
  }

  /**
    * Register a new event handler
    * @param {AbstractEvent} AbstractEvent Target event handler module
    * @returns {void}
    */
  register(AbstractEvent) {
    this[AbstractEvent.name] = new AbstractEvent(this.client);
  }
}

module.exports = EventsManager;
