const { TelegramClient } = require('messaging-api-telegram');
const TelegramServer = require('telegram-test-api');

const tgBot = require('./telegram-bot');

describe('Telegram bot service', () => {
  const telegramBotToken = '12345679:ABCDEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE';
  const telegramChatId = '12345678';

  let server;
  let client;
  let bot;

  const streamData = {
    title: 'I am streaming something cool Kappa',
  };

  const makeMsg = (twitchChannel) =>
    [
      `<code>${bot.safeMsg(streamData.title)}</code>`,
      `🔴 o canal twitch.tv/${twitchChannel} está <b>ao vivo</b>!`,
    ].join('\n');

  // Setup
  beforeAll(async () => {
    const serverConfig = {
      port: 9000,
      host: 'localhost',
      storage: 'RAM',
      storeTimeout: 60,
    };
    server = new TelegramServer(serverConfig);

    tgBot._serverUrl = server.ApiURL; // hacky
    bot = tgBot(telegramBotToken, telegramChatId);

    await server.start();
    client = server.getClient(telegramBotToken);
  });

  // Teardown
  afterAll(async () => {
    await server.stop();
  });

  it('Should encode the stream title properly to do not broke the bot message', () => {
    const expectedText = '&lt;/code&gt;&lt;code&gt;hehe&lt;/code&gt;';
    const text = bot.safeMsg('</code><code>hehe</code>');
    expect(text).toBe(expectedText);
  });

  it('Should send the right message to the right channel', async () => {
    const whenBotMessage = server.waitBotMessage();

    const msg = makeMsg('codigofalado');

    const botMessagePayloadExpected = {
      chat_id: telegramChatId,
      text: msg,
      parse_mode: 'HTML',
      disable_notification: false,
      disable_web_page_preview: true,
    };

    await bot.sendMessage(msg); // `null` due to fake server limitations

    await whenBotMessage;
    expect(server.storage.botMessages.length).toBe(1);

    const botMessagePayload = server.storage.botMessages[0].message;
    expect(botMessagePayload).toEqual(botMessagePayloadExpected);
  });

  it('Should delete the last message sent', async () => {
    const updates = await client.getUpdatesHistory();
    expect(updates.length).toBe(1);

    const idLastMessageSent = updates[0].messageId;
    expect(typeof idLastMessageSent).toBe('number');

    await bot.deleteMessage(idLastMessageSent);

    expect(server.storage.botMessages.length).toBe(0);
  });
});
