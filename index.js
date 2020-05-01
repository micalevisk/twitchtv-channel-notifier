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

task(storage, {
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  telegramChatId: process.env.TELEGRAM_CHAT_ID,

  twitchChannel: process.env.TWITCH_CHANNEL,
  twitchClientId: process.env.TWITCH_CLIENT_ID,
  twitchOAuthAccessToken: process.env.TWITCH_OAUTH_ACCESS_TOKEN,
})
  .then((res) => dumpJson(storageFilename, res))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
