export async function execute(sock, msg, messageText, args) {
  function choice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  const answers = [
    "It is certain.",
    "It is decidedly so.",
    "Without a doubt.",
    "Yes – definitely.",
    "You may rely on it.",
    "As I see it, yes.",
    "Most likely.",
    "Outlook good.",
    "Yes.",
    "Signs point to yes.",
    "Reply hazy, try again.",
    "Ask again later.",
    "Better not tell you now.",
    "Cannot predict now.",
    "Concentrate and ask again.",
    "Don't count on it.",
    "My reply is no.",
    "My sources say no.",
    "Outlook not so good.",
    "Very doubtful."
  ];
  let answer = choice(answers);
  let question = messageText.slice(12);
  await sock.sendMessage(msg.key.remoteJid, {
    text: `*_Magic 8 Ball_*\n\n*Question*\n${question}\n\n*Answer*\n${answer}`,
  });
}
