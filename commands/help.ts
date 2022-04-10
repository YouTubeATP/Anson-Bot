export async function execute(sock, msg, messageText, args) {
  if (args.length < 1) {
    await sock.sendMessage(msg.key.remoteJid, { text: "*Use* ```a!help <category>``` *to get help for it.*\n\n_fun_ - Fun\n_util_ - Utilities\n_mc_ - Minecraft\n_mr_ - MR\n_osu_ - osu!\n_misc_ - Miscellaneous" });    
    return;
  }
  else {
    switch (args[0]) {
      case "fun":
        await sock.sendMessage(msg.key.remoteJid, { text: "*Fun commands*\n\n```a!cat``` - Sends you a lovely cat.\n\n```a!dog``` - Gives you a dog.\n\n```a!dick``` - How long is it?\n\n```a!eightball <question>``` - The classic Magic 8 Ball.\n\n```a!random [q!question]:<item1>:<item2>:<item3>``` - Chooses a random item.\nUsage examples:\n```a!random q!Which language is the best:English:Chinese:Hindi:Japanese```\n```a!random Cats:Dogs:Rabbits```\n\n[] Optional <> Required" });
        break;
      case "util":
        await sock.sendMessage(msg.key.remoteJid, { text: "*Utility commands*\n\n```a!remindme <time> [reminder]``` - Sends you a reminder.\nUsage Examples:\n```a!remindme -d:2 -h:1 -m:30 -s:15 \"2 days, 1 hour, 30 minutes, and 15 seconds\"```\n```a!remindme -m:10```\n\n[] Optional <> Required" });
        break;
      case "mc":
        await sock.sendMessage(msg.key.remoteJid, { text: "*Minecraft commands*\n\n```a!mcping <ip> <type> [port]``` - Pings a Minecraft Server.\nUsage Examples:\n```a!mcping play.aurummcnet.ga java 25565```\n\n[] Optional <> Required" });
        break;
      case "mr":
        await sock.sendMessage(msg.key.remoteJid, { text: "*MR commands*\n\n```a!stationlist``` - Sends you a list of MR Stations and their codes.\n\n```a!stationinfo <station code> [eng|chi]``` - Sends you data of the related station.\n\n[] Optional <> Required" });
        break;
      case "osu":
        await sock.sendMessage(msg.key.remoteJid, { text: "*osu! commands*\n\n```a!osulink <username>``` - Associates your WhatsApp account with an osu! user.\n\n```a!osuprofile <username> [standard|taiko|catch|mania]``` - Sends you the profile of a given user/ your linked user.\n\n```a!osurecent <username> [standard|taiko|catch|mania]``` - Sends you the recent play of a given user/ your linked user.\n\n[] Optional <> Required" });
        break;
      case "misc":
        await sock.sendMessage(msg.key.remoteJid, { text: "*Miscellaneous commands*\n\n```a!help [category]``` - Sends you a list of commands.\n\n```a!ban <area code><phone number>``` - _(Admins only)_ Bans a user from interacting with the bot.\n\n```a!ping``` - Sends you a ping.\n\n[] Optional <> Required" });
        break;
    }
  }
}