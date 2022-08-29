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

var lastAnswer = ""

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
                ws.send(JSON.stringify({'pong':true}));
            }, 20000)
        }
        else if (msg.hasOwnProperty("nickname")){  //nickname set

            nick = msg.nickname
            console.log(lastId)
            lastId++;
            console.log(lastId)
            db.create(lastId, nick);

            response = {
                "id": lastId
            }

            ws.send(JSON.stringify(response))
        }
        else if(msg.hasOwnProperty("qn") && msg.hasOwnProperty("ans") && msg.hasOwnProperty("id")&& msg.hasOwnProperty("time")){

            id = msg.id
            score = 0
            time = msg.time
            lastAnswer = amqp.getLastAnswer()
            if (ans == lastAnswer){
                score = 100 - time/100
            }
            else{
                score = 0
            }
            db.update(id, score)
        }

        else{
            //qui facciamo handling del crash

            // if(lastAnswer != amqp.getLastAnswer()){
            //     lastAnswer = amqp.getLastAnswer()
            // }

            // console.log("##########")
            // console.log(lastAnswer)
            // console.log("##########")
            // ws.send(lastAnswer)
        }
    })

    ws.on('close', () => {
        console.log('WebSocket was closed')
    })
})


amqp.amqplisten();


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
