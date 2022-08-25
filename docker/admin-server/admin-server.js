const express = require('express');
const app = express();

var amqp = require('amqplib/callback_api');

var cors = require('cors')
app.use(cors())

app.use(express.json());

// Constants
const PORT = process.env.PORT;
const HOST = '0.0.0.0';
const URLRABBIT = "amqp://rabbitmq"

// App

app.post('/start', (req, res) => {
    console.log('Question starting');

    amqp.connect(URLRABBIT, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
            var exchange = 'starts';
            var msg = JSON.stringify(req.body);
    
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

    res.send({'msg':'Question started'});
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
