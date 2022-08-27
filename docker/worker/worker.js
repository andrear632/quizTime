const express = require('express');
const enableWs = require('express-ws')

const amqp = require('./message_broker_functions.js')
const db = require('./db_functions.js')


// Constants
const SERVICE_NAME = process.env.SERVICE_NAME;
const PORT = process.env.PORT;
const WPORT = process.env.WPORT;
const HOST = '0.0.0.0';


// App
const app = express();
enableWs(app)

app.use(express.static('user_webapp'));


// app.get('/', (req, res) => {
//     console.log(`service: ${SERVICE_NAME} is called`);
//     res.send(`Hello world,Your in ${SERVICE_NAME}\n`);
    
// });


app.ws('/ws', (ws, req) => {
    ws.on('message', msg => {
        if (msg=="ping") {
            setTimeout(function() {
                ws.send("pong");
            }, 20000)
        }
        else {
            db.update("10", 9.7)
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



// const { Client } = require('@elastic/elasticsearch')
// const client = new Client({ node: 'http://elasticsearch:9200' })

// async function run () {
//   await client.index({
//     index: 'game-of-thrones',
//     id: '1',
//     body: {
//       character: 'Ned Stark',
//       quote: 'Winter is coming.'
//     }
//   })

//   const { body } = await client.get({
//     index: 'game-of-thrones',
//     id: '1'
//   })

//   console.log(body)
// }

// run().catch(console.log)