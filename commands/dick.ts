export async function execute(sock, msg, messageText, args) {
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function between(x, min, max) {
    return x >= min && x <= max;
  }

  let stem = "=";
  let length = randInt(0, 31);
  if (length == 0) {
    var atp = "Wow you have no dick";
  } else if (between(length, 1, 5)) {
    var atp = "Wow your dick is kind of smol";
  } else if (between(length, 6, 10)) {
    var atp = "I suppose it can do the job?";
  } else if (between(length, 11, 17)) {
    var atp = "Average. Not good, but not bad";
  } else if (between(length, 17, 22)) {
    var atp = "Holy, that's long";
  } else if (between(length, 23, 29)) {
    var atp = "Damn yours is way above average";
  } else if (length == 30) {
    var atp = "Bro I envy you";
  }
  let dick = stem.repeat(length);
  await sock.sendMessage(msg.key.remoteJid, {
    text: "8" + dick + `D\n\n${atp}`,
  });
}
