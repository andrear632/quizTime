const express = require('express');
const app = express();

var amqp = require('amqplib/callback_api');

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var cors = require('cors')
app.use(cors())

//Deve ricevere post dall'admin e mandare websocket

// Constants
const PORT = process.env.PORT;
const HOST = '0.0.0.0';
const URLRABBIT = "amqp://rabbitmq"

// App

app.post('/start', (req, res) => {
    console.log('Question starting');
    var info = req.body;

    amqp.connect(URLRABBIT, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
            var exchange = 'starts';
            var msg = req.body;
    
            channel.assertExchange(exchange, 'fanout', {
                durable: false
            });
            channel.publish(exchange, '', Buffer.from(msg));
            console.log("Sent %s", msg);
        });
        setTimeout(function() {
            connection.close();
            process.exit(0);
        }, 500);
    });

    res.send('Question starting');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
