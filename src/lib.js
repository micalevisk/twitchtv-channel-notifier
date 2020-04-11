const fetch = require('node-fetch').default;

/**
 *
 * @param {string} userId
 * @param {string} clientId
 */
module.exports.userIsLive = (userId, clientId) =>
  fetch('https://api.twitch.tv/helix/streams?user_id=' + userId, {
    headers: {
      'Client-ID': clientId,
    },
  })
    .then((res) => res.json())
    .then(({ data }) => data.length > 0);
