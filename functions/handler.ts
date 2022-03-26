import * as commands from "../export";

export async function handler(sock, message) {
  // const sendMessageWTyping = async (msg: AnyMessageContent, jid: string) => {
  //   await sock.presenceSubscribe(jid);
  //   await delay(500);

  //   await sock.sendPresenceUpdate("composing", jid);
  //   await delay(2000);

  //   await sock.sendPresenceUpdate("paused", jid);

  //   await sock.sendMessage(jid, msg);
  // };

  var config = {
    commandPrefix: "a!"
  };

  try {
    var messageText = message.message.conversation ? message.message.conversation : message.message.extendedTextMessage.text;
  } catch (TypeError) {
    return;
  }
  var args = messageText.slice(config.commandPrefix.length).trim().split(/ +/);
  
  function joinArgs(args) {
    let inQuote = false;
    let newArgs = [];
    for (let i = 0; i < args.length; i++) {
      if (args[i].startsWith("\"")) {
        inQuote = true;
        var joinedArg = args[i].slice(1);
        continue;
      }
      if (inQuote) {
        if (!args[i].endsWith("\"")) {
          joinedArg = joinedArg + " " + args[i];
          continue; 
        } else {
          joinedArg = joinedArg + " " + args[i].slice(0, -1);
          inQuote = false;
        }
      } else {
        joinedArg = args[i];
      }
      newArgs.push(joinedArg);
    }
    return newArgs;
  }
  
  args = joinArgs(args);

  const commandName = args.shift().toLowerCase();
  const command = commands[commandName];

  if (command && (messageText.startsWith("a!") || messageText.startsWith("A!"))) {
    await command.execute(sock, message, messageText, args).catch(error => {
      console.error(error);
    });
  };

  // const sentMsg = await sock.sendMessage(message.key.remoteJid, {
  //   text: message.message.conversation
  //     ? message.message.conversation
  //     : message.message.extendedTextMessage.text,
  // });
  // console.log(JSON.stringify(sentMsg));
}
