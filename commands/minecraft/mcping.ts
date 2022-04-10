const mc = require("minecraft-server-status-simple");

export async function execute(sock, msg, messageText, args) {
  let ip: string = args[0];
  let type: string = args[1];
  let port: number = Number(args[2]);
  const typeRegex = /^bedrock|java/gi;
  if (!type) {
    await sock.sendMessage(msg.key.remoteJid, { text: "You have to specify the type of the server to ping!" });
    return;
  }
  if (!typeRegex.test(type)) {
    await sock.sendMessage(msg.key.remoteJid, { text: "Type can only be either ```bedrock``` or ```java```." });
    return;
  }
  if (!ip) {
    await sock.sendMessage(msg.key.remoteJid, { text: "You have to specify an IP address to ping!" });
    return;
  }
  if (!port || port === NaN) {
    switch (type) {
      case "bedrock":
        port = 19132;
        break;
      case "java":
        port = 25565;
        break;
    }
  }
  mc.status(type, ip, port)
    .then((res) => {
      let m = "";
      let a = res.online ? "_🟢 This server is online!_" : "_🔴 This server is offline!_";
      m += `_*Ping result of ${res.hostname} [${res.ip}:${res.port}]:*_`;
      m += "\n" + a;
      if (res.online) {
        m += `\n\n*${res.motd.clean}*`;
        m += `\n${res.players.online}/${res.players.max} players online`;
      }
      sock.sendMessage(msg.key.remoteJid, { text: m });
    })
    .catch((err) => {
      sock.sendMessage(msg.key.remoteJid, { text: `An error occurred` });
      console.error(err);
    });
}



