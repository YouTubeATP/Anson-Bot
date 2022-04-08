const moment = require("moment");

export async function execute(sock, msg, messageText, args) {
  let inTimeRegex = /(^\-d:|\-h:|\-m:|\-s:).*$/gm;
  let UTCRegex = /\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2]\d|3[0-1])T(?:[0-1]\d|2[0-3]):[0-5]\d:[0-5]\dZ/;
  if (inTimeRegex.test(args[0])) {
    let day: number;
    let hour: number;
    let minute: number;
    let second: number;
    for (let i = 0; i < args.length; i++) {
      switch (args[i].slice(0, 3)) {
        case "-d:":
          day = Number(args[i].slice(3));
        case "-h:":
          hour = Number(args[i].slice(3));
        case "-m:":
          minute = Number(args[i].slice(3));
        case "-s:":
          second = Number(args[i].slice(3));
      }
    }
    var ms = ((day * 24 * 60 * 60 * 1000) || 0) + ((hour * 60 * 60 * 1000) || 0) + ((minute * 60 * 1000) || 0) + ((second * 1000) || 0);
  } else if (UTCRegex.test(args[0])) {
    let time = moment(args[0]);
    var ms = Number(moment().diff(time, "seconds")) * 1000;
  }
  let reminderText: string;
  if (!inTimeRegex.test(args[args.length - 1])) {
    reminderText = args[args.length - 1];
  } else {
    reminderText = "Your reminder is here!";
  }

  let id: string = msg.key.remoteJid.endsWith("@g.us") ? msg.key.participant.slice(0, msg.key.participant.length - 16) : msg.key.remoteJid.slice(0, msg.key.remoteJid.length - 16);
  setTimeout(() => {
    sock.sendMessage(msg.key.remoteJid, { text: `@${id} *${reminderText}*` });
  }, ms)
}