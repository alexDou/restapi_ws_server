const express = require('express');
const http = require('http');
const WebSocket = require('ws');


// Express
const app = express();
const server = http.createServer(app);


// WebSocket init
let sock;
const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
    console.log('WS Connection established');
    sock = ws;
});

// API endpoints
const machineApp = express.Router();

machineApp.post('/unlock/cc', (req, res) => {
    console.log('unclock cc received');
    sock.send(createMessage('UNLOCK_SCREEN', 'cc'));
    res.end();
});
machineApp.post('/unlock/cclite', (req, res) => {
    sock.send(createMessage('UNLOCK_SCREEN', 'ccl'));
    res.end();
});
machineApp.post('/lock', (req, res) => {
    sock.send(createMessage('LOCK_SCREEN'));
    res.end();
});
machineApp.post('/message/oasis', (req, res) => {
    sock.send(createMessage('OASIS', 'hehe'));
    res.end();
});
machineApp.post('/message/blocked', (req, res) => {
    sock.send(createMessage('BLOCKED'));
    res.end();
});

app.use('/machineapp/ccl', machineApp);

function createMessage(type, value = '') {
    return JSON.stringify({ event, value });
}

//start server
server.listen(9000, () => {
    console.log(`Server is listening on port ${server.address().port}`);
});
