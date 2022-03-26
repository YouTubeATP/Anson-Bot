require("dotenv").config();
const node_osu = require('node-osu');
const osu = new node_osu.Api(process.env.OSU_API_KEY, {
  notFoundAsError: false,
  completeScores: true,
  parseNumeric: true,
});
const fs = require("fs");
const axios = require('axios');

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export async function execute(sock, msg, messageText, args) {
  let osuNames = JSON.parse(fs.readFileSync("./assets/" + "osuNames.json", (err) => {
    if (err) {
      throw err;
    }
  }));

  var id = msg.key.participant ? msg.key.participant : msg.key.remoteJid;
  let user;
  const modeRegex = /^[0-3]|standard|taiko|catch|mania+$/i;
  let modeArg;

  if (args[0]) {
    if (modeRegex.test(args[0])) {
      modeArg = args[0];
      if (args[1]) {
        user = args[1];
      } else {
        user = osuNames[id];
      }
    } else if (modeRegex.test(args[1])) {
      modeArg = args[1];
      user = args[0];
    } else if (!args[1]) {
      modeArg = "0";
      user = args[0];
    }
  } else {
    modeArg = "0";
    user = osuNames[id];
  }

  if (user === undefined) {
    sock.sendMessage(msg.key.remoteJid, { text: "You have to specify a user, or link your osu! account using ```a!osulink```!" });
    return;
  }

  switch (modeArg) {
    case "standard":
      var mode = 0;
      break;
    case "taiko":
      var mode = 1;
      break;
    case "catch":
      var mode = 2;
      break;
    case "mania":
      var mode = 3;
      break;
    case "0":
    case "1":
    case "2":
    case "3":
      var mode = Number(modeArg);
      break;
    default:
      var mode = 0;
  }

  switch (mode) {
    case 0:
      var modeName = "Standard";
      break;
    case 1:
      var modeName = "Taiko";
      break;
    case 2:
      var modeName = "Catch the Beat!";
      break;
    case 3:
      var modeName = "Mania";
      break;
  }

  osu.getUser({ u: user, m: mode, type: "string" }).then(user => {
    try {
      var m = `*osu! ${modeName} profile for ${user.name}:*`;    
      m += `\n▸ _Bancho Rank:_ #${numberWithCommas(user.pp.rank.toString())} (${user.country}#${numberWithCommas(user.pp.countryRank)})`;
      m += `\n▸ _Level:_ ${user.level.toString().split(".")[0]} + ${user.level.toString().split(".")[1].slice(0, 2)}.${user.level.toString().split(".")[1].slice(2)}%`;
      m += `\n▸ _PP:_ ${numberWithCommas(user.pp.raw.toString().split(".")[0])}.${user.pp.raw.toString().split(".")[1]}`;
      m += `\n▸ _Accuracy:_ ${user.accuracy.toFixed(2).toString()}%`;
      m += `\n▸ _Play Count:_ ${numberWithCommas(user.counts.plays.toString())}`;
      m += `\n▸ _Ranks:_ SSH x ${user.counts.SSH} | SS x ${user.counts.SS} | SH x ${user.counts.SH} | S x ${user.counts.S} | A x ${user.counts.A}`;
    } catch (err) {
      if (err instanceof TypeError) {
        sock.sendMessage(msg.key.remoteJid, { text: "The profile for this user is not found. Did you make a typo?" });
        return;
      } else {
        throw err;
      }
    }

    const buttons = [ {index: 1, urlButton: {displayText: 'Go to user page', url: `https://osu.ppy.sh/users/${user.id}`}} ]

    let buttonMessage;

    // Testing rather the link works magic
    axios.get(`http://s.ppy.sh/a/${user.id}.jpg`)
    .then(function (res) {
      buttonMessage = {
        caption: m,
        footer: "Anson-Bot",
        templateButtons: buttons,
        image: { url: `http://s.ppy.sh/a/${user.id}.jpg` }
      };
    })
    .catch(function (err) {
      buttonMessage = {
        caption: m,
        footer: "Anson-Bot",
        templateButtons: buttons,
        image: { url: `http://osu.ppy.sh/images/layout/avatar-guest.png` }
      };
    })
    .then(function () {
      sock.sendMessage(msg.key.remoteJid, buttonMessage);
    })
  });
}