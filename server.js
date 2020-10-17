const express = require('express');

const port = 3001;
const ip = '127.0.0.1';
let users = [];

const app = express();
app.route('/api/v1/realtime')
    .get(registerForSSE);

var server = app.listen(port, ip, _ => { console.log(`Server is running`); });


function registerForSSE(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    const newUser = {
        ts: Date.now(),
        res
    };

    users.push(newUser);

    req.on('close', () => {
        users = users.filter(c => c.ts !== newUser.ts);
    });
}

setInterval(() => {
    sendHeartbeat();
}, 5000);

function sendHeartbeat() {
    console.log(`Sending heartbeat to ${users.length} clients`);
    users.forEach(client => {
        const timestamp = new Date().getTime();
        client.res.write(`event: heartbeat\nid: ${timestamp}\ndata:\n\n`);
        client.res.flushHeaders();
    });
}