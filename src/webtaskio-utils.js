const IN_LOCAL = process.env.NODE_ENV === 'local';

module.exports = (function () {
  if (!IN_LOCAL) {
    const writeToStorage = (ctx, data) =>
      new Promise((resolve, reject) => {
        ctx.storage.set(data, { force: 1 }, (error) => {
          if (error) return reject(error);
          return resolve(data);
        });
      });

    const readFromStorage = (ctx) =>
      new Promise((resolve, reject) => {
        ctx.storage.get((error, data) => {
          if (error) return reject(error);
          return resolve(data || {});
        });
      });

    return {
      writeToStorage,
      readFromStorage,
    };
  }

  /* This should be executed only locally. */

  const fs = require('fs');
  const path = require('path');
  const { promisify } = require('util');

  const pathToStorageFile = path.join(__dirname, '..', 'storage.json');

  const asyncReadFile = promisify(fs.readFile);
  const asyncWriteFile = promisify(fs.writeFile);

  const writeToStorage = (_ctx, data) =>
    asyncWriteFile(pathToStorageFile, JSON.stringify(data, null, 2), { encoding: 'utf8' });

  const readFromStorage = (_ctx) =>
    asyncReadFile(pathToStorageFile, {
      encoding: 'utf8',
    }).then((content) => JSON.parse(content));

  return {
    writeToStorage,
    readFromStorage,
  };
})();
