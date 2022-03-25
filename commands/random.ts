function choice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export async function execute(sock, msg, messageText, args) {
  let questionqr: string;
  let argy = messageText.slice(9).split(":");  
  if (argy[0].startsWith("q!")) {
    questionqr = argy.shift().slice(2);
  } else {
    questionqr = "Random item";
  }
  await sock.sendMessage(msg.key.remoteJid, { text: `*_${questionqr}_*\n\n${choice(argy)}` });
}