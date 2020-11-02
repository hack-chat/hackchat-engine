/**
  * An extended version of Map which includes methods that are Array-like
  * @extends {Map}
  */
class ExtMap extends Map {
  /**
    * Emulates `Array.find()`, returning the first map value
    * @param {Function} findFn A function to execute on each element in
    *   the map until the function returns true, indicating
    *   that the satisfying element was found
    * @returns {*}
    * @example
    * client.users.findKey(val => val.username === 'Name');
    */
  find(findFn) {
    for (const [key, val] of this) { // eslint-disable-line no-restricted-syntax
      if (findFn(val, key, this)) return val;
    }

    return null;
  }

  /**
    * Emulates `Array.findIndex()`, returning the first map key
    * @param {Function} findFn A function to execute on each element in
    *   the map until the function returns true, indicating
    *   that the satisfying element was found
    * @returns {*}
    * @example
    * client.users.findKey(val => val.username === 'Name');
    */
  findKey(findFn) {
    for (const [key, val] of this) { // eslint-disable-line no-restricted-syntax
      if (findFn(val, key, this)) return key;
    }

    return null;
  }

  /**
    * Emulates `Array.filter()`
    * @param {Function} filterFn Truthy function used to test each element
    * @returns {ExtMap}
    */
  filter(filterFn) {
    const results = new ExtMap();
    for (const [key, val] of this) { // eslint-disable-line no-restricted-syntax
      if (filterFn(val, key, this)) results.set(key, val);
    }

    return results;
  }

  /**
    * Emulates `Array.some()`
    * @param {Function} someFn Truthy function used to test each element
    * @returns {boolean}
    */
  some(someFn) {
    for (const [key, val] of this) { // eslint-disable-line no-restricted-syntax
      if (someFn(val, key, this)) return true;
    }

    return false;
  }

  /**
    * Emulates `Array.every()`
    * @param {Function} everyFn Truthy function used to test each element
    * @returns {boolean}
    */
  every(everyFn) {
    for (const [key, val] of this) { // eslint-disable-line no-restricted-syntax
      if (!everyFn(val, key, this)) return false;
    }

    return true;
  }
}

export default ExtMap;
