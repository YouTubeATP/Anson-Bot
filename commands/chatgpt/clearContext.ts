const fs = require('fs');

export async function execute(sock, msg, messageText, args) {
    let id: string = msg.key.participant ? msg.key.participant+msg.key.remoteJid : msg.key.remoteJid;
    let contexts: object = JSON.parse(fs.readFileSync("./assets/contexts.json", (err) => {
        if (err) {
            throw err;
        }
    }));
    contexts[id] = []
    fs.writeFileSync("./assets/contexts.json", JSON.stringify(contexts))
    await sock.sendMessage(msg.key.remoteJid, { text: `Context cleared!` })
}