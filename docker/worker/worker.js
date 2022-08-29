const express = require('express');
const enableWs = require('express-ws')

const amqp = require('./message_broker_functions.js')
const db = require('./db_functions.js')


// Constants
const SERVICE_NAME = process.env.SERVICE_NAME;
const PORT = process.env.PORT;
const WPORT = process.env.WPORT;
const HOST = '0.0.0.0';

const baseId = parseInt(SERVICE_NAME.charAt(SERVICE_NAME.length - 1))*100000;
var lastId = baseId;

// App
const app = express();
enableWs(app)

app.use(express.static('user_webapp'));


// app.get('/', (req, res) => {
//     console.log(`service: ${SERVICE_NAME} is called`);
//     res.send(`Hello world,Your in ${SERVICE_NAME}\n`);
    
// });


app.ws('/ws', (ws, req) => {

    ws.on('connection', msq =>{
        console.log("Connection Initialized");
        console.log(msg)
    })

    ws.on('message', msg => {

        msg = JSON.parse(msg)

        if (msg.ping) {
            setTimeout(function() {
                ws.send(JSON.stringify("{'pong':true}"));
            }, 20000)
        }
        else if (msg.hasOwnProperty("nickname")){  //nickname set

            nick = msg.nickname

            lastId++;
            db.create(lastId, nick);

            response = {
                "id": lastId
            }

            ws.send(JSON.stringify(response))
        }
        else if(msg.hasOwnProperty("qn")){

            id = msg.id
            score = 0
            time = 0
            //dobbiamo decidere come calcolare il punteggio e tenere conto del tempo
            //in piu come gestiamo la domanda corretta
            db.update(id, score, time)
        }
        else if(false){
            //qui facciamo handling del crash
        }
        else {
            db.update("10", 4, 9.7)
            db.get("10")
            ws.send(SERVICE_NAME)
        }
    })

    ws.on('close', () => {
        console.log('WebSocket was closed')
    })
})


amqp.amqplisten();


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
