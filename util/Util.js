import fetch from 'node-fetch';
import { DefaultOptions } from './Constants.js';

const ConstantsHttp = DefaultOptions.http;

/**
  * General static utility functions, used by many classes and structures
  */
class Util {
  /**
    * Gets the websocket connection details from the client config file
    * @returns {object} The websocket config object
    */
  // eslint-disable-next-line class-methods-use-this
  async fetchWebsocketConfig() {
    const url = ConstantsHttp.configPath;

    try {
      const response = await fetch(url);
      const json = await response.json();
      return json;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default Util;
