const cats = require("cats-js");

export async function execute(sock, msg, messageText, args) {
  let c = new cats();
  c.get().then((cat) => {
    sock.sendMessage(msg.key.remoteJid, {
      image: { url: cat.images.image.url },
      caption: "Meow!"
    });
  });
}