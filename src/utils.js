const fs = require('fs');

/**
 *
 * @param {string} filename
 */
module.exports.readJson = (filename) => {
  const rawData = fs.readFileSync(filename, { encoding: 'utf8' });
  return JSON.parse(rawData);
};

/**
 *
 * @param {string} filename
 * @param {object} obj
 * @param {boolean} [verbose=true]
 */
module.exports.dumpJson = (filename, obj, verbose = true) => {
  const serialized = JSON.stringify(obj, null, 2);
  if (verbose) {
    console.log(serialized);
  }
  return fs.writeFileSync(filename, serialized);
};
