const dogs = require('doggo-api-wrapper');

export async function execute(sock, msg, messageText, args) {
  let d = new dogs();
  d.getARandomDog().then(dog => {
    sock.sendMessage(msg.key.remoteJid, {
      image: { url: dog.message },
      caption: "Here's your dog 😒"
    });
  });
}