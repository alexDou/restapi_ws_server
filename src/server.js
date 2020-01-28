const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');


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

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// API endpoints
const machineApp = express.Router();

machineApp.post('/unlock/cc', (req, res) => {
    sock.send(createMessage('UNLOCK_SCREEN', 'cc'));
    res.end();
});
machineApp.post('/unlock/cclite', (req, res) => {
    sock.send(createMessage('UNLOCK_SCREEN', 'cclite'));
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
    sock.send(createMessage('BLOCKED', 'blocked'));
    res.end();
});

app.use('/machineapp/ccl', machineApp);

app.get('/machineapp/event/recommendation', (req, res) => {
    // read file somewhere in file system
    let rawJson = fs.readFileSync(path.join(__dirname, '../json/data.json'), 'utf8');
    res.send(rawJson);
});

app.post('/machineapp/customer/recommendation/confirmFirstView', (req, res) => {
    res.send('ok');
});

function createMessage(type, value = false) {
    const message = { type };
    if (value) {
        message.value = value;
    }

    return JSON.stringify(message);
}

//start server
server.listen(9000, () => {
    console.log(`Server is listening on port ${server.address().port}`);
});
