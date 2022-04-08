require("dotenv").config();
const fs = require("fs");

function remove(arr, value) {
  var i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
  return arr;
}

export async function execute(sock, msg, messageText, args) {
  let sender: string = msg.key.participant ? msg.key.participant : msg.key.remoteJid;
  
  let owners: Array<string> = JSON.parse(process.env.OWNER);

  if (!owners.includes(sender)) {
    await sock.sendMessage(msg.key.remoteJid, { text: "Sorry, but you do not have permission to execute this command." });
    return;
  }

  if (args.length < 1) {
    await sock.sendMessage(msg.key.remoteJid, { text: "You have to specify a user to ban!" });
    return;
  } else if (args.length > 1) {
    await sock.sendMessage(msg.key.remoteJid, { text: "You have to specify only one user to ban!" });
    return;
  }

  let user: string = args[0];

  let bans: Array<string> = JSON.parse(fs.readFileSync("./assets/bans.json", (err) => {
    if (err) {
      throw err;
    }
  }));

  let userId = args[0] + "@s.whatsapp.net";

  if (!bans.includes(userId)) {
    bans.push(userId);
    fs.writeFileSync("./assets/bans.json", JSON.stringify(bans));
    await sock.sendMessage(msg.key.remoteJid, { text: `Successfully banned user *${user}*!` });
    return;
  } else {
    remove(bans, userId);
    fs.writeFileSync("./assets/bans.json", JSON.stringify(bans));
    await sock.sendMessage(msg.key.remoteJid, { text: `Successfully unbanned user *${user}*!` });
    return;
  }
}
