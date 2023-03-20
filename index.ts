import makeWASocket, { DisconnectReason, BufferJSON, useMultiFileAuthState } from '@adiwajshing/baileys'
import * as fs from 'fs'
import { Boom } from '@hapi/boom'
import { handler } from './functions/handler'

async function connectToWhatsApp () {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')

    const sock = makeWASocket({
        // can provide additional config here
        printQRInTerminal: true,

        auth: state
    })
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
            // reconnect if not logged out
            if(shouldReconnect) {
                connectToWhatsApp()
            }
        } else if(connection === 'open') {
            console.log('opened connection')
        }
    })
    sock.ev.on('messages.upsert', async m => {
        console.log(JSON.stringify(m, undefined, 2))
        const msg = m.messages[0]
        if(!msg.key.fromMe && m.type === 'notify') {
            const key = {
                remoteJid: msg.key.remoteJid,
                id: msg.key.id,
                participant: msg.key.participant
            }
            await sock.readMessages([key])
            
            // My custom command handler, at ./functions/handler.ts
            await handler(sock, msg)
        }
    })
    sock.ev.on('creds.update', saveCreds);
}
// run in main file
connectToWhatsApp()