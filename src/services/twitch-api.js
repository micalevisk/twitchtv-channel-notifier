const fetch = require('node-fetch').default;

const makePrependWord = (word) => (text) => word + text;

/**
 * @param {string} clientId - Your app client ID.
 * @param {string} oauthAccessToken - Your app access token.
 */
module.exports = function twitchAPI(clientId, oauthAccessToken) {
  const baseURL = 'https://api.twitch.tv/helix';
  const opts = {
    headers: {
      'Client-ID': clientId,
      Authorization: 'Bearer ' + oauthAccessToken,
    },
  };

  const prependWithUserLogin = makePrependWord('user_login=');

  return {
    /** @see https://dev.twitch.tv/docs/api/reference#get-streams */
    getStream: (userLogin) =>
      fetch(`${baseURL}/streams/?${prependWithUserLogin(userLogin)}`, opts)
        .then((res) => res.json())
        .then(({ data, error, message }) => {
          if (error) {
            process.exitCode = 11;
            throw new Error(`${error}: ${message}`);
          }
          return {
            isLive: data.length > 0 && data[0].type === 'live',
            ...data[0],
          };
        }),
  };
};
