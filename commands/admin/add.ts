const cats = require("cats-js");

export async function execute(sock, msg, messageText, args) {
  let group: string = msg.key.remoteJid
  if (!group.endsWith("@g.us")) {
    sock.sendMessage(msg.key.remoteJid, { text: "You may only use this command in a group." });
  }

  const response = await sock.groupParticipantsUpdate(
    "abcd-xyz@g.us", 
    ["abcd@s.whatsapp.net", "efgh@s.whatsapp.net"],
    "add" // replace this parameter with "remove", "demote" or "promote"
  );
}