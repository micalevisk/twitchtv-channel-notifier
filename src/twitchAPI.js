const fetch = require('node-fetch').default;

module.exports = function twitchAPI(clientId, userId) {
  const baseURL = 'https://api.twitch.tv/helix';
  const opts = {
    headers: {
      'Client-ID': clientId,
    },
  };

  /** @see https://dev.twitch.tv/docs/api/reference#get-streams */
  const getStream = () =>
    fetch(`${baseURL}/streams?user_id=${userId}`, opts)
      .then((res) => res.json())
      .then(({ data }) => ({ isLive: data.length > 0, ...data[0] }));

  return {
    getStream,
  };
};
