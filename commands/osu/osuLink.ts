const fs = require("fs");

export async function execute(sock, msg, messageText, args) {
  if (args.length < 1) {
    sock.sendMessage(msg.key.remoteJid, { text: "You have to specify a username to link to!" });
    return;
  } else if (args.length > 1) {
    sock.sendMessage(msg.key.remoteJid, { text: "You have to specify only one username to link to!\nIf your username contains spaces, contain your username with double quotes.\n_e.g. \"Username with spaces\"_" });
    return;
  }
  let username = args[0];
  
  let osuNames = JSON.parse(fs.readFileSync("./assets/osuNames.json", (err) => {
    if (err) {
      throw err;
    }
  }));
  var id = msg.key.participant ? msg.key.participant : msg.key.remoteJid;
  osuNames[id] = username;
  fs.writeFileSync("./assets/osuNames.json", JSON.stringify(osuNames))
  await sock.sendMessage(msg.key.remoteJid, { text: `Successfully linked your WhatsApp account to osu! user *${username}*!` });
}