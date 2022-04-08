import * as commands from "../export";
import { nonCommandCheck } from "./nonCommandCheck";
const fs = require("fs");

export async function handler(sock, message) {
  // const sendMessageWTyping = async (msg: AnyMessageContent, jid: string) => {
  //   await sock.presenceSubscribe(jid);
  //   await delay(500);

  //   await sock.sendPresenceUpdate("composing", jid);
  //   await delay(2000);

  //   await sock.sendPresenceUpdate("paused", jid);

  //   await sock.sendMessage(jid, msg);
  // };

  
  let bans: Array<string> = JSON.parse(fs.readFileSync("./assets/bans.json", (err) => {
    if (err) {
      throw err;
    }
  }));

  let sender: string = message.key.participant ? message.key.participant : message.key.remoteJid;

  if (bans.includes(sender)) {
    console.info("Blocked user " + sender + "'s attempt using the bot.")
    return;
  }

  var config = {
    commandPrefix: "a!"
  };

  try {
    var messageText: string = message.message.conversation ? message.message.conversation : message.message.extendedTextMessage.text;
  } catch (TypeError) {
    return;
  }
  var args: Array<string> = messageText.slice(config.commandPrefix.length).trim().split(/ +/);
  
  function joinArgs(args): Array<string> {
    let inQuote = false;
    let newArgs: Array<string> = [];
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
    // Commands
    await command.execute(sock, message, messageText, args).catch(error => {
      console.error(error);
    });
  } else {
    // Non-commands, such as a certain phrase
    await nonCommandCheck(sock, message, messageText, args).catch(error => {
      console.error(error);
    });
  }

  // const sentMsg = await sock.sendMessage(message.key.remoteJid, {
  //   text: message.message.conversation
  //     ? message.message.conversation
  //     : message.message.extendedTextMessage.text,
  // });
  // console.log(JSON.stringify(sentMsg));
}
