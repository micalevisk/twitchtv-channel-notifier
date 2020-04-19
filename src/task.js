const tgBot = require('./services/telegram-bot');
const twitchAPI = require('./services/twitch-api');

module.exports = async (storage, ctx) => {
  let { idLastMessageSent } = storage;
  const { isLive: lastRunIsLive } = storage;
  const { twitchClientId, telegramBotToken, telegramChatId, channelName } = ctx;

  const bot = tgBot(telegramBotToken, telegramChatId);
  const api = twitchAPI(twitchClientId);

  const { isLive, ...streamData } = await api.getStream(channelName);

  if (idLastMessageSent && !isLive) {
    await bot.deleteMessage(idLastMessageSent).catch(console.error);
    idLastMessageSent = null;
  }

  let lastMessageSent;
  if (isLive && !lastRunIsLive) {
    const msg = [
      `<code>${bot.safeMsg(streamData.title)}</code>`,
      `🔴 O canal twitch.tv/${channelName} está <b>ao vivo</b>!`,
    ].join('\n');
    lastMessageSent = await bot.sendMessage(msg);
  }

  return {
    isLive,
    idLastMessageSent:
      idLastMessageSent ||
      (lastMessageSent && lastMessageSent.result.message_id),
  };
};
