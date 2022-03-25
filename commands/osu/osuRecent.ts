require("dotenv").config();
const node_osu = require('node-osu');
const osu = new node_osu.Api(process.env.OSU_API_KEY, {
  notFoundAsError: false,
  completeScores: true,
  parseNumeric: true,
});

const fs = require("fs");

// enum Mods
// {
//     None           = 0,
//     NoFail         = 1,
//     Easy           = 2,
//     TouchDevice    = 4,
//     Hidden         = 8,
//     HardRock       = 16,
//     SuddenDeath    = 32,
//     DoubleTime     = 64,
//     Relax          = 128,
//     HalfTime       = 256,
//     Nightcore      = 512, // Only set along with DoubleTime. i.e: NC only gives 576
//     Flashlight     = 1024,
//     Autoplay       = 2048,
//     SpunOut        = 4096,
//     Relax2         = 8192,    // Autopilot
//     Perfect        = 16384, // Only set along with SuddenDeath. i.e: PF only gives 16416  
//     Key4           = 32768,
//     Key5           = 65536,
//     Key6           = 131072,
//     Key7           = 262144,
//     Key8           = 524288,
//     FadeIn         = 1048576,
//     Random         = 2097152,
//     Cinema         = 4194304,
//     Target         = 8388608,
//     Key9           = 16777216,
//     KeyCoop        = 33554432,
//     Key1           = 67108864,
//     Key3           = 134217728,
//     Key2           = 268435456,
//     ScoreV2        = 536870912,
//     Mirror         = 1073741824,
//     KeyMod = Key1 | Key2 | Key3 | Key4 | Key5 | Key6 | Key7 | Key8 | Key9 | KeyCoop,
//     FreeModAllowed = NoFail | Easy | Hidden | HardRock | SuddenDeath | Flashlight | FadeIn | Relax | Relax2 | SpunOut | KeyMod,
//     ScoreIncreaseMods = Hidden | HardRock | DoubleTime | Flashlight | FadeIn
// }

// According to OSU API's enabled_mods bitmask, converts a given number sum to a list of enabled mods.
function sumToModList(sum) {
  let modList = [];

  // Bitmask magic
  if (sum & 1 << 0) {
    modList.push("NF");
  }
  if (sum & 1 << 1) {
    modList.push("EZ");
  }
  if (sum & 1 << 3) {
    modList.push("HD");
  }
  if (sum & 1 << 4) {
    modList.push("HR");
  }
  if (sum & 1 << 5) {
    modList.push("SD");
  }
  if (sum & 1 << 9) {
    modList.push("NC");
  } else if (sum & 1 << 6) {
    modList.push("DT");
  }
  if (sum & 1 << 7) {
    modList.push("RX");
  }
  if (sum & 1 << 8) {
    modList.push("HT");
  }
  if (sum & 1 << 10) {
    modList.push("FL");
  }
  if (sum & 1 << 12) {
    modList.push('SO');
  }
  if (sum & 1 << 14) {
    modList.push('PF');
  }
  if (sum & 1 << 15) {
    modList.push('4K');
  }
  if (sum & 1 << 16) {
    modList.push('5K');
  }
  if (sum & 1 << 17) {
    modList.push('6K');
  }
  if (sum & 1 << 18) {
    modList.push('7K');
  }
  if (sum & 1 << 19) {
    modList.push('8K');
  }
  if (sum & 1 << 20) {
    modList.push('FI');
  }
  if (sum & 1 << 24) {
    modList.push('9K');
  }
  if (sum & 1 << 25) {
    modList.push('10K');
  }
  if (sum & 1 << 26) {
    modList.push('1K');
  }
  if (sum & 1 << 27) {
    modList.push('3K');
  }
  if (sum & 1 << 28) {
    modList.push('2K');
  }

  const index = modList.indexOf("DT");
  if (index > -1 && modList.includes("NC")) {
    modList.splice(index, 1);
  }

  return modList;
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export async function execute(sock, msg, messageText, args) {
  let osuNames = JSON.parse(fs.readFileSync("./assets/" + "osuNames.json", (err) => {
    if (err) {
      throw err;
    }
  }));

  let modeRegex = /^[0-3]|standard|taiko|catch|mania+$/i;
  let modeArg;
  let user;
  var id = msg.key.participant ? msg.key.participant : msg.key.remoteJid;

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

  var rs;
  console.error(user);
  console.error(mode);
  osu.getUserRecent({ u: user, m: mode, limit: 1 }).then((res) => {
    rs = res[0];
    if (rs === undefined) {
      sock.sendMessage(msg.key.remoteJid, { text: "No recent plays were found. Maybe this player hasn't played in the last 24 hours?" });
      return;
    }

    switch (mode) {
      case 0:
        var modeName = "Standard";
        var type = "osu";
        break;
      case 1:
        var modeName = "Taiko";
        var type = "taiko";
        break;
      case 2:
        var modeName = "Catch the Beat!";
        var type = "fruits";
        break;
      case 3:
        var modeName = "Mania";
        var type = "mania";
        break;
    }
    let m = `_*Recent osu! ${modeName} play for ${user}:*_\n\n*${rs.beatmap.title} [${rs.beatmap.version}]*`;
    let mods = sumToModList(rs.raw_mods);
    var modsString = "";
    for (let i = 0; i < mods.length; i++) {
      modsString += mods[i];
    }
    if (modsString.length > 0) {
      m += ` *+${modsString}*`;
    }
    m += ` *[${rs.beatmap.difficulty.rating.toFixed(2)}★]*`;

    let rank;
    switch (rs.rank) {
      case "XH":
        rank = "SS (Hidden)";
        break;
      case "X":
        rank = "SS";
        break;
      case "SH":
        rank = "S (Hidden)";
        break;
      default:
        rank = rs.rank;
    }
    m += `\n▸ _${rank}_ ▸ _${(rs.accuracy * 100).toFixed(2)}%_`;
    m += `\n▸ _${numberWithCommas(rs.score)}_ ▸ _x${rs.maxCombo}/${rs.beatmap.maxCombo}_ ▸ _[${rs.counts["300"]}/${rs.counts["100"]}/${rs.counts["50"]}/${rs.counts.miss}]_`;
    console.log(m);
    
    const buttons = [ {index: 1, urlButton: {displayText: 'Go to beatmap page', url: `https://osu.ppy.sh/beatmapsets/${rs.beatmap.beatmapSetId}#${type}/${rs.beatmap.id}`}} ]

    let buttonMessage = {
      caption: m,
      footer: "Anson-Bot",
      templateButtons: buttons,
      image: { url: "https://assets.ppy.sh/beatmaps/" + rs.beatmap.beatmapSetId.toString() + "/covers/cover.jpg" }
    };

    sock.sendMessage(msg.key.remoteJid, buttonMessage);
  });
} 