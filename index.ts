// Adapted from https://github.com/adiwajshing/Baileys/blob/master/Example/example.ts

import { Boom } from '@hapi/boom'
import P from 'pino'
import makeWASocket, { AnyMessageContent, delay, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, useSingleFileAuthState } from '@adiwajshing/baileys'
import { handler } from './functions/handler'

// the store maintains the data of the WA connection in memory
// can be written out to a file & read from it
const store = makeInMemoryStore({ logger: P().child({ level: 'debug', stream: 'store' }) })
store.readFromFile('./assets/baileys_store_multi.json')
// save every 10s
setInterval(() => {
    store.writeToFile('./assets/baileys_store_multi.json')
}, 10_000)

const { state, saveState } = useSingleFileAuthState('./assets/auth_info_multi.json')

const fs = require("fs");
const AWS = require("aws-sdk");
require("dotenv").config();

const s3 = new AWS.S3({
    maxRetries: 3,
    httpOptions: {timeout: 30000, connectTimeout: 5000},
    region: 'us-east-1',
    accessKeyId: process.env.ID,
    secretAccessKey: process.env.SECRET,
});

const uploadFile = (fileName) => {
    try {
        // Read content from the file
        const fileContent = fs.readFileSync("./assets/" + fileName, (err) => {
            if (err) {
                throw err;
            }
        });

        // Setting up S3 upload parameters
        const params = {
            Bucket: process.env.NAME,
            Key: fileName, // File name you want to save as in S3
            Body: fileContent,
        };

        // Uploading files to the bucket
        s3.upload(params, function (err, data) {
            if (err) {
                throw err;
            }
            console.log(`Uploaded ${fileName} to AWS`);
        });
    } catch (err) {
        console.log(err);
        return;
    }
};
    
const downloadFile = (fileName) => {
    s3.getObject(
        { Bucket: process.env.NAME, Key: fileName },
        function (error, data) {
            if (error != null) {
                console.log("Failed to retrieve an object:\n" + JSON.stringify(error));
            } else {
                console.log("Loaded " + data.ContentLength + " bytes");
                fs.writeFile("./assets/" + fileName, data.Body, { flag: "w" }, (err) => {
                    if (err) {
                        throw err;
                    }
                });
            }
        }
    );
};

if (!(process.argv[2] && process.argv[2] === "--no-download")) {
    downloadFile("osuNames.json");
    downloadFile("baileys_store_multi.json");
    downloadFile("credits.json");
    downloadFile("bans.json");
    downloadFile("auth_info_multi.json");
}

setInterval(() => {
    uploadFile("osuNames.json");
    uploadFile("baileys_store_multi.json");
    uploadFile("credits.json");
    uploadFile("bans.json");
    uploadFile("auth_info_multi.json");
}, 180000); // 3 minutes

// start a connection
const startSock = async() => {
    // fetch latest version of WA Web
    const { version, isLatest } = await fetchLatestBaileysVersion()
    console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`)

    const sock = makeWASocket({
        version,
        logger: P({ level: 'trace' }),
        printQRInTerminal: true,
        auth: state,
        // implement to handle retries
    })

    store.bind(sock.ev)

    const sendMessageWTyping = async(msg: AnyMessageContent, jid: string) => {
        await sock.presenceSubscribe(jid)
        await delay(500)

        await sock.sendPresenceUpdate('composing', jid)
        await delay(2000)

        await sock.sendPresenceUpdate('paused', jid)

        await sock.sendMessage(jid, msg)
    }
    
    sock.ev.on('chats.set', item => console.log(`recv ${item.chats.length} chats (is latest: ${item.isLatest})`))
    sock.ev.on('messages.set', item => console.log(`recv ${item.messages.length} messages (is latest: ${item.isLatest})`))
    sock.ev.on('contacts.set', item => console.log(`recv ${item.contacts.length} contacts`))

    sock.ev.on('messages.upsert', async m => {
        console.log(JSON.stringify(m, undefined, 2))
        
        const msg = m.messages[0]
        
        if(!msg.key.fromMe && m.type === 'notify') {
            // My custom command handler, at ./functions/handler.ts
            await handler(sock, msg)
        }
        
    })

    sock.ev.on('messages.update', m => console.log(m))
    sock.ev.on('message-receipt.update', m => console.log(m))
    sock.ev.on('presence.update', m => console.log(m))
    sock.ev.on('chats.update', m => console.log(m))
    sock.ev.on('contacts.upsert', m => console.log(m))

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if(connection === 'close') {
            // reconnect if not logged out
            if((lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut) {
                startSock()
            } else {
                console.log('Connection closed. You are logged out.')
            }
        }
        
        console.log('connection update', update)
    })
    // listen for when the auth credentials is updated
    sock.ev.on('creds.update', saveState)

    return sock
}

startSock()