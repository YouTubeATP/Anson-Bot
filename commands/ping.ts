export async function execute(sock, msg, messageText, args) {
  function choice(array): any {
    return array[Math.floor(Math.random() * array.length)];
  }

  const responses = [
    "ポン！",
    "ぽん！",
    "Pong!",
    "I am Anson-Bot, and I am working.",
    "Yes, sir. I am willing to serve!",
    "Maybe go study instead of pinging me?",
    "Yes, the bot is working. You don't need to test it.\n\nPong. You happy now?",
    "Did you know you're flooding my traffic by pinging me?\n\nPong.",
    "At your service, master. Pong.",
    "_Pong!_\n\nContrary to what most people believe, Pong was not the first-ever video game. The first arcade game was Computer Space, which was released just a year before Pong in 1971. Computer Space was an arcade game that featured a rocket facing off against flying saucers in a starfield, with missiles as the only weapons. And there were a number of experimental video games released in the sixties, like 1969’s Space Travel and 1952’s Noughts and Crosses, or OXO.\nComputer Space was not as influential or as successful as Pong. However, its release marked the beginning of the video game industry.",
    "_Pong!_\n\nPong is the game most responsible for the Golden Age of arcade video games. But that’s not where its influence ends. With the release of Home Pong, Atari helped to popularize video game home consoles. Home Pong was also cloned, and many of the clone makers still make video games and consoles to this day.\nPong has also been referenced in a number of more recent video games, like The Xbox 360’s Banjo-Kazooie: Nuts & Bolts and the Commodore 64’s Neuromancer. The game has even been featured in TV shows like Saturday Night Live, King of the Hill and That ‘70s Show."
  ]

  await sock.sendMessage(msg.key.remoteJid, {
    text: choice(responses)
  });
}