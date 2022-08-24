var amqp = require('amqplib/callback_api');
var fs = require('fs');

function producer(messaggio) {

    amqp.connect('amqp://rabbitmq', function(error0, connection) {
        if (error0) {
            //throw error0; 
            console.log("Sistema di Log NON Funzionante " + error0.toString());
            return;
        }

        connection.createChannel(function(error1, channel) {
            if (error1) {
                console.log("Sistema di Log NON Funzionante " + error0.toString());
                return;
            }

            var queue = 'MSG_QUEUE';
            var msg = messaggio

            channel.assertQueue(queue, {
                durable: true
            });

            console.log("-- INVIANDO MESSAGGIO '%s' ALLA CODA %s --", msg, queue);

            channel.sendToQueue(queue, Buffer.from(msg), {
                persistent: true
            });

            console.log("-- HO INVIATO IL MESSAGGIO --");

        });


        setTimeout(function() { //importante mettere il timeout perchè altrimenti la connessione si chiude
            connection.close(); // prima di riuscire a passare il msg
        }, 500);

    });

}

function consumer() {
    amqp.connect('amqp://rabbitmq', function(error0, connection) {
        if (error0) {
            console.log("Sistema di Log NON Funzionante " + error0.toString());
            return;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                console.log("Sistema di Log NON Funzionante " + error0.toString());
                return;
            }
            var queue = 'MSG_QUEUE';

            channel.assertQueue(queue, {
                durable: true
            });
            channel.prefetch(1);

            console.log("-- ATTENDO MESSAGGI DALLA CODA %s --", queue);

            channel.consume(queue, function(msg) {

                console.log("--> Ricevuto %s ", msg.content.toString());


                //distingue se il messaggio è un errore o è un successo, si possono aggiungere anche altri casi
                var path;
                var header = msg.content.toString().substring(0, 8);
                if (header == '[ERRORE]') {
                    path = 'ERROR.log';
                } else {
                    var date = new Date();
                    path = date.toLocaleDateString().split('/').reverse().join('_') + '.log'
                }

                fs.appendFileSync(path, msg.content.toString() + "\n");
                channel.ack(msg);
                console.log("-- LOG AGGIUNTO --");

            }, {

                noAck: false
            });
        });
    });

}


module.exports.producer = producer;
module.exports.consumer = consumer;
