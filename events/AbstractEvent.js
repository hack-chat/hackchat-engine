/**
  * Base event handler class, all events extend this class
  * @private
  */
class AbstractEvent {
  /**
    * @param {Client} client Main client reference
    */
  constructor(client) {
    this.client = client;
  }

  /**
    * Generic event handler function
    * @param {object} data Incoming event data
    * @returns {object}
    */
  static handle(data) {
    return {
      data,
    };
  }
}

export default AbstractEvent;
