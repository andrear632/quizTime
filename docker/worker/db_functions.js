const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://elasticsearch:9200' })

async function create(id, nick) {

    await client.create({
      index: 'game',
      id: id,
      body: {
        nickname: nick,
        score: 0,
        time: 0.0
      }
    })
  
    console.log(body)
}

async function update(id, time){
    await client.update({
        index: 'game',
        id: id,
        body: {
          script: {
            lang: "painless",
            source: "ctx._source.score++; ctx._source.time += params['newTime']",
            params: {
                newTime: time
            }
          }
        }
      })
}


module.exports.create = create;
module.exports.update = update;

  