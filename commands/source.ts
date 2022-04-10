export async function execute(sock, msg, messageText, args) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "Here is the bot's source code, for you to audit:\nhttps://github.com/YouTubeATP/Anson-Bot"
  });
}