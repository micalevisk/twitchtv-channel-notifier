const fetch = require('node-fetch').default;

const makePrependWord = (word) => (text) => word + text;

module.exports = function twitchAPI(clientId) {
  const baseURL = 'https://api.twitch.tv/helix';
  const opts = {
    headers: {
      'Client-ID': clientId,
    },
  };

  const prependWithUserLogin = makePrependWord('user_login=');

  return {
    /** @see https://dev.twitch.tv/docs/api/reference#get-streams */
    getStream: (userLogin) =>
      fetch(`${baseURL}/streams/?${prependWithUserLogin(userLogin)}`, opts)
        .then((res) => res.json())
        .then(({ data }) => ({
          isLive: data.length > 0 && data[0].type === 'live',
          ...data[0],
        })),
  };
};
