const tgBot = require('./tgBot');
const { userIsLive } = require('./lib');
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

  const { CLIENT_ID, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, CHANNEL_ID, CHANNEL_NAME } = ctx.secrets;

  const { deleteMessage, sendMessage } = tgBot(TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID);

  try {
    const [isLive, { lastRunIsLive, lastMsgId }] = await Promise.all([
      userIsLive(CHANNEL_ID, CLIENT_ID),
      getLastSavedData(),
    ]);

    if (lastMsgId && !isLive) {
      await deleteMessage(lastMsgId).catch(console.error);
    }

    let lastMessageSent = null;
    if (isLive && !lastRunIsLive) {
      lastMessageSent = await sendMessage(`🔴 O canal twitch.tv/${CHANNEL_NAME} está ao vivo!`);
    }

    await saveLastRun(isLive, lastMessageSent);

    return { ok: true, isLive };
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
