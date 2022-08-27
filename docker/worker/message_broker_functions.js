var amqp = require('amqplib/callback_api');

async function amqplisten() {
    amqp.connect('amqp://rabbitmq', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
            var exchange = 'starts';

            channel.assertExchange(exchange, 'fanout', {
                durable: false
            });

            channel.assertQueue('', {
                exclusive: true
            }, function(error2, q) {
                if (error2) {
                    throw error2;
                }
                console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
                channel.bindQueue(q.queue, exchange, '');

                channel.consume(q.queue, function(msg) {
                    if (msg.content) {
                        //qui va la gestione del messaggio che segna l'inizio di una domanda,
                        //viene ricevuto dall'admin server.
                        //è in json con la struttura {correct:A, qn:1}, dove correct indica la
                        //risposta corretta e qn il question number.
                        //msg.content contiene il json ricevuto.
                        console.log(" [x] %s", msg.content.toString());
                    }
                }, {
                    noAck: true
                });
            });
        });

        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
            var exchange = 'ends';

            channel.assertExchange(exchange, 'fanout', {
                durable: false
            });

            channel.assertQueue('', {
                exclusive: true
            }, function(error2, q) {
                if (error2) {
                    throw error2;
                }
                console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
                channel.bindQueue(q.queue, exchange, '');

                channel.consume(q.queue, function(msg) {
                    if (msg.content) {
                        //qui va la gestione del messaggio che segna l'inizio di una domanda,
                        //viene ricevuto dall'admin server.
                        //è in json con la struttura {correct:A, qn:1}, dove correct indica la
                        //risposta corretta e qn il question number.
                        //msg.content contiene il json ricevuto.
                        console.log(" [x] %s", msg.content.toString());
                    }
                }, {
                    noAck: true
                });
            });
        });


    });
}

module.exports.amqplisten = amqplisten;