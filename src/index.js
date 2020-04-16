const tgBot = require('./telegram-bot');
const twitchAPI = require('./twitch-api');
const { readFromStorage, writeToStorage } = require('./webtaskio-utils');

async function task(ctx) {
  const saveLastRun = (isLive, lastMessageSent) => {
    if (lastMessageSent && lastMessageSent.ok) {
      return writeToStorage(ctx, {
        lastRunIsLive: isLive,
        lastMsgId: lastMessageSent.result.message_id,
      });
    }

    return writeToStorage(ctx, { lastRunIsLive: isLive });
  };
  const getLastSavedData = () => readFromStorage(ctx);

  const { CLIENT_ID, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, CHANNEL_NAME } = ctx.secrets;

  const bot = tgBot(TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID);
  const api = twitchAPI(CLIENT_ID);

  try {
    const [{ isLive, ...streamData }, { lastRunIsLive, lastMsgId }] = await Promise.all([
      api.getStream(CHANNEL_NAME),
      getLastSavedData(),
    ]);

    if (lastMsgId && !isLive) {
      await bot.deleteMessage(lastMsgId).catch(console.error);
    }

    let lastMessageSent;
    if (isLive && !lastRunIsLive) {
      const msg = [
        `🔴 <code>${streamData.title}</code>`,
        `O canal twitch.tv/${CHANNEL_NAME} está <b>ao vivo</b>!`,
      ].join('\n');

      lastMessageSent = await bot.sendMessage(msg);
    }

    await saveLastRun(isLive, lastMessageSent);

    return { ok: true, isLive, messageSent: !!lastMessageSent };
  } catch (err) {
    console.error(err);
    return { ok: false, err: err.message || err };
  }
}

module.exports = (ctx, cb) => {
  task(ctx)
    .then((res) => cb(null, res))
    .catch(cb);
};
