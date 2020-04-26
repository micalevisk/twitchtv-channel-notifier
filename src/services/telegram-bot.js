const Slimbot = require('slimbot');

/**
 *
 * @param {string} botToken - Your bot Token. Grab it from @botfather.
 * @param {string|number} targetChatId - Unique identifier for the target chat
 * or username of the target channel (in the format `@channelusername`)
 */
module.exports = function tgBot(botToken, targetChatId) {
  const slimBot = new Slimbot(botToken);
  return {
    // https://core.telegram.org/bots/api#sendmessage
    sendMessage: (text) =>
      slimBot.sendMessage(targetChatId, text, {
        parse_mode: 'HTML',
        disable_notification: false,
        disable_web_page_preview: true,
      }),

    // https://core.telegram.org/bots/api#deletemessage
    deleteMessage: (messageId) =>
      slimBot.deleteMessage(targetChatId, messageId),

    /** Create safe string interpolation. */
    safeMsg: (text = '') =>
      text
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;'),
  };
};
