const fetch = require('node-fetch');
const { DefaultOptions } = require('./Constants');

const ConstantsHttp = DefaultOptions.http;

/**
  * General static utility functions, used by many classes and structures
  */
class Util {
  /**
    * Gets the websocket connection details from the client config file
    * @returns {object} The websocket config object
    */
  static async fetchWebsocketConfig() {
    const url = ConstantsHttp.configPath;

    try {
      const response = await fetch(url);
      const json = await response.json();
      return json;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
    * Sets default properties on an object that aren't already specified.
    * Preform a deep merge, adding missing props to `given` from `def`
    * @param {object} def Default properties
    * @param {object} given Object to assign defaults to
    * @returns {object}
    */
  static mergeDefault(def, given) {
    if (!given) {
      return def;
    }

    for (const key in def) { // eslint-disable-line no-restricted-syntax
      if (!{}.hasOwnProperty.call(given, key)) {
        given[key] = def[key]; // eslint-disable-line no-param-reassign
      } else if (given[key] === Object(given[key])) {
        // eslint-disable-next-line no-param-reassign
        given[key] = this.mergeDefault(def[key], given[key]);
      }
    }

    return given;
  }
}

module.exports = Util;
