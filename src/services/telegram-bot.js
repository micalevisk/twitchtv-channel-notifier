const { TelegramClient } = require('messaging-api-telegram');

/**
 *
 * @param {string} botToken - Your bot Token. Grab it from @botfather.
 * @param {string|number} targetChatId - Unique identifier for the target chat
 * or username of the target channel (in the format `@channelusername`)
 */
module.exports = function tgBot(botToken, targetChatId) {
  const client = new TelegramClient({
    accessToken: botToken,
    // Hack way to inject this 'origin' value when
    // running tests :(
    origin: process.env.NODE_ENV === 'test' ? tgBot._serverUrl : undefined,
  });

  return {
    // https://core.telegram.org/bots/api#sendmessage
    sendMessage: (text) =>
      client.sendMessage(targetChatId, text, {
        parse_mode: 'HTML',
        disable_notification: false,
        disable_web_page_preview: true,
      }),

    // https://core.telegram.org/bots/api#deletemessage
    deleteMessage: (messageId) => client.deleteMessage(targetChatId, messageId),

    /** Create safe string interpolation. */
    safeMsg: (text = '') =>
      text
        // Following: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#rule-1-html-encode-before-inserting-untrusted-data-into-html-element-content
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;'),
  };
};
