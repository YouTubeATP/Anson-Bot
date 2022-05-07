export async function execute(sock, msg, messageText, args) {
    const emojisExist = /\p{Extended_Pictographic}/ug;

    if (!msg.message.extendedTextMessage.contextInfo) {
        await sock.sendMessage(msg.key.remoteJid, { text: "Reply this command to the message you want me to react to!" });
        return;
    }

    if (!emojisExist.test(args[0])) {
        await sock.sendMessage(msg.key.remoteJid, { text: "You must specify an *emoji* to react!" });
        return;
    }

    if (args[0].length != 1) {
        await sock.sendMessage(msg.key.remoteJid, { text: "You must specify only one *emoji* to react!" });
        return;
    }

    var reactionMessage = {
        react: {
            text: args[0],
            key: msg.message.extendedTextMessage.contextInfo.stanzaId
        }
    }

    await sock.sendMessage(msg.key.remoteJid, reactionMessage);
}