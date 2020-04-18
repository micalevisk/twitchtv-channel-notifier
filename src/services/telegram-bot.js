const Slimbot = require('slimbot');

/**
 *
 * @param {string} botToken
 * @param {string|number} targetChatId
 */
module.exports = function tgBot(botToken, targetChatId) {
  const slimBot = new Slimbot(botToken);

  const sendMessage = (text) =>
    slimBot.sendMessage(targetChatId, text, {
      parse_mode: 'HTML',
      disable_notification: false,
      disable_web_page_preview: true,
    });

  const deleteMessage = (messageId) =>
    slimBot.deleteMessage(targetChatId, messageId);

  const safeMsg = (text = '') =>
    text
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  return {
    sendMessage,
    deleteMessage,
    safeMsg,
  };
};
