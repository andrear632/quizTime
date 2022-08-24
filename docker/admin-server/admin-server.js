const express = require('express');

//Deve ricevere post dall'admin e mandare websocket

// Constants
const PORT = process.env.PORT;
const HOST = '0.0.0.0';

// App
const app = express();
app.post('/', (req, res) => {
    console.log(`service: ${SERVICE_NAME} is called`);
    res.send(`Hello world,Your in ${SERVICE_NAME}\n`);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
