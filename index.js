require('dotenv-safe').config({
  allowEmptyValues: false,
  example: '.env.example',
});

const task = require('./src/task');
const { readJson, dumpJson } = require('./src/utils');

if (process.argv.length !== 3) {
  throw new Error('Missing storage file name arg.');
}

const storageFilename = process.argv[2];
const storage = readJson(storageFilename);

const dispatchAction = () => {
  const fetch = require('node-fetch');
  const { REPO, GH_PERSONAL_ACCESS_TOKEN } = process.env;
  return fetch(`https://api.github.com/repos/${REPO}/dispatches`, {
    method: 'POST',
    body: JSON.stringify({ event_type: 'webhook_notification' }),
    headers: {
      Authorization: `Bearer ${GH_PERSONAL_ACCESS_TOKEN}`,
    },
  });
};

task(storage, {
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  telegramChatId: process.env.TELEGRAM_CHAT_ID,

  twitchChannel: process.env.TWITCH_CHANNEL,
  twitchClientId: process.env.TWITCH_CLIENT_ID,
  twitchOAuthAccessToken: process.env.TWITCH_OAUTH_ACCESS_TOKEN,
})
  .then((res) => dumpJson(storageFilename, res))
  .catch((err) => {
    if (process.exitCode === 11) {
      return dispatchAction();
    }
    throw err;
  })
  .catch((err) => {
    console.log('Will exit with code', process.exitCode);
    console.error(err);
  });
