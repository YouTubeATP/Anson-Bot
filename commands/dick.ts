export async function execute(sock, msg, messageText, args) {
  function randInt(min, max): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function between(x, min, max) {
    return x >= min && x <= max;
  }

  let stem = "=";
  let length: number = randInt(0, 31);
  var m: string;
  if (length == 0) {
    m = "Wow you have no dick";
  } else if (between(length, 1, 5)) {
    m = "Wow your dick is kind of smol";
  } else if (between(length, 6, 10)) {
    m = "I suppose it can do the job?";
  } else if (between(length, 11, 17)) {
    m = "Average. Not good, but not bad";
  } else if (between(length, 17, 22)) {
    m = "Holy, that's long";
  } else if (between(length, 23, 29)) {
    m = "Damn yours is way above average";
  } else if (length == 30) {
    m = "Bro I envy you";
  }
  let dick = stem.repeat(length);
  await sock.sendMessage(msg.key.remoteJid, {
    text: "8" + dick + `D\n\n${m}`,
  });
}
