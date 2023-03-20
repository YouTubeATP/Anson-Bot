const axios = require('axios');
const fs = require('fs');
import { createHash } from 'node:crypto';

axios.defaults.headers['Content-Type'] = 'application/json';

const maxContextLength = 5;

export async function execute(sock, msg, messageText, args) {
    let id: string = msg.key.participant ? msg.key.participant+msg.key.remoteJid : msg.key.remoteJid;
    let hash = createHash('sha256').update(id).digest('hex');

    let prompt: string = messageText.slice(10);

    let contexts: object = JSON.parse(fs.readFileSync("./assets/contexts.json", (err) => {
        if (err) {
            throw err;
        }
    }));
    
    let contextText = "For the prompt below, \"Q:\" indicates a prompt and \"A:\" indicates your response.\nIf \"A:\" is given, then this question-answer pair is our previous conversation, for your reference.\nIf \"A:\" is not given, then that question is your latest prompt. Answer it as you would do normally.\nThe \"Qs\" and \"As\" are only for your reference. DO NOT include them in your responses.\n\n";
    if (contexts[id] === undefined || !contexts[id]) {
        contextText += "Q: " + prompt + "\nA: ";
    } else {
        contexts[id].forEach(context => {
            contextText += `Q: ${context.prompt}\nA: ${context.response}\n\n`
        })
        contextText += "Q: " + prompt + "\nA: ";
    }

    if (contexts[id] === undefined) {
        contexts[id] = [];
    }

    while (contexts[id].length > maxContextLength) {
        contexts[id].shift();
    }

    console.log(contextText);

    axios.post("https://sharegpt.churchless.tech/share/v1/chat", {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": contextText}],
        "user": hash
    }).then((response) => {
        console.log(response);
        console.log(response.data.choices[0]);
        let res = response.data.choices[0].message.content.replace(/`/g, "```").replace(/^```(.*)\n$/g, "```")
        if (res.startsWith("\n\n")) {
            res = res.slice(2);
        } else if (res.startsWith("\n")) {
            res = res.slice(1);
        }
        sock.sendMessage(msg.key.remoteJid, { text: res });
        contexts[id].push({"prompt": prompt, "response": res});
        while (contexts[id].length > maxContextLength) {
            contexts[id].shift();
        }
        fs.writeFileSync("./assets/contexts.json", JSON.stringify(contexts))
    }).catch((error) => {
        console.log("error");
        console.error(error);
        if (error.response.status === 522 || error.response.status === 524) {
            sock.sendMessage(msg.key.remoteJid, { text: "Oops, ChatGPT has timed out! Please try again later." });
        }
    });
}