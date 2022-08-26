const express = require('express');

const amqp = require('./message_broker_functions.js')

var WebSocketServer = require('websocket').server;
var http = require('http');


// Constants
const SERVICE_NAME = process.env.SERVICE_NAME;
const PORT = process.env.PORT;
const WPORT = process.env.WPORT;
const HOST = '0.0.0.0';


// App
const app = express();
app.use(express.static('user_webapp'));
// app.get('/', (req, res) => {
//     console.log(`service: ${SERVICE_NAME} is called`);
//     res.send(`Hello world,Your in ${SERVICE_NAME}\n`);
    
// });

var server = http.createServer();
server.listen(WPORT, function() { });
wsServer = new WebSocketServer({
    httpServer: server
});

// Gestione degli eventi
wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    connection.on('message', function(message) {
        // Metodo eseguito alla ricezione di un messaggio
        if (message.type === 'utf8') {
            // Se il messaggio è una stringa, possiamo leggerlo come segue:
            console.log('Il messaggio ricevuto è: ' + message.utf8Data);
        }
    });
    connection.on('close', function(connection) {
        // Metodo eseguito alla chiusura della connessione
    });
});


amqp.amqplisten();


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);