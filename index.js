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
  twitchClientId: process.env.TWITCH_CLIENT_ID,
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  telegramChatId: process.env.TELEGRAM_CHAT_ID,
  channelName: process.env.TWITCH_CHANNEL_NAME,
})
  .then((res) => dumpJson(storageFilename, res))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
