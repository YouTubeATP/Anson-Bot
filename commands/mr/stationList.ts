import { stationData } from "../../assets/stationData";

export async function execute(sock, msg, messageText, args) {
    let m = "";
    for (const key in stationData) {
        let lines: Array<string> = stationData[key].line.split(" ");
        let res = (lines.length >= 3) ? `*${key}* - ${stationData[key].cname}檢查站 ${stationData[key].ename} Checkpoint\n` : `*${key}* - ${stationData[key].cname}站 ${stationData[key].ename} Station\n`;
        m += res;
    }
    await sock.sendMessage(msg.key.remoteJid, { text: m });
};