import { stationData } from "../../assets/stationData";

export async function execute(sock, msg, messageText, args) {
  if (args[0] in stationData) {
    var key = args[0];
    var lang = args[1] ? args[1] : "eng";
    var name = lang === "eng" ? stationData[key].ename : stationData[key].cname;
    var lines = stationData[key].line.split(" ");
    if (lang === "eng") {
      var stationType = lines.length >= 3 ? "Checkpoint" : "Station";
      var lineNames = {
        MSL: "Milestone Line",
        NEL: "New Era Line",
        EWL: "East-West Line",
        CAL: "Cave Line",
        CIL: "City Line",
        EBL: "EST Branch Line",
        IIL: "Interisland Line",
      };
      var linee = "";
      lines.forEach((line) => {
        linee += lineNames[line] + ", ";
      });
      var res = `*${name} ${stationType}*\n\n_Passing Lines_ - ${linee.slice(
        0,
        -2
      )}\n_No. of exits_ - ${stationData[key].exit}\n_X, Z Coordinates_ - (${
        stationData[key].x
      }, ${stationData[key].z})`;
    } else if (lang === "chi") {
      var stationType = lines.length >= 3 ? "檢查站" : "站";
      var lineNames = {
        MSL: "里程綫",
        NEL: "新代綫",
        EWL: "東西綫",
        CAL: "洞穴綫",
        CIL: "城市綫",
        EBL: "站站講支綫",
        IIL: "跨島綫",
      };
      var linee = "";
      lines.forEach((line) => {
        linee += lineNames[line] + "、";
      });
      var res = `*${name}${stationType}*\n\n_途經路綫_ - ${linee.slice(
        0,
        -1
      )}\n_出口數量_ - ${stationData[key].exit}\n_X, Z 座標_ - (${
        stationData[key].x
      }, ${stationData[key].z})`;
    }
    await sock.sendMessage(msg.key.remoteJid, { text: res });
  } else {
    await sock.sendMessage(msg.key.remoteJid, {
      text: `Could not find station ${args[0]}!`,
    });
  }
}
