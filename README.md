# quizTime
We created an application that makes TV game shows interactive to increase the shares of the program. The audience from home uses a web app to participate in the game answering the questions asked live in the studio. They have an interface to choose between correct answers and be included in a scoreboard in the show.

At the start of the game, each user that opens the mobile web app will be assigned an identifier code and will be asked to give a nickname. When a question is asked in the studio, all the players will see it through the television and 4 buttons will appear on their smartphone screen. Each button will be assigned to a possible answer. The player will only have to press the button linked to the answer they think is correct. The web app will then send to the server the response together with the id of the player, his nickname and an identifier of the question. When time runs out the buttons disappear.

Having a lot of participants, the server managing users’ answers is distributed. We have a set of workers, each one handling only a fraction of the total requests. In this way the system can tolerate data burst. A load balancer is used to split the requests among all the workers.

The admin have an interface to set the correct answers of the questions. For each round he will trigger messages to notify the start of a question to the web applications and to the server accepting the responses. There will be a time out for the question, so the workers stop accepting data and send the scores of every player to Elasticsearch.
Using Kibana we generate statistical graphs and the scoreboard to be displayed in the admin interface and in the show for the audience.
At the end of the game every player will receive his score and the top 10 will be displayed in the show for the audience.

Technologies we plan to use:
- Docker to containerize each service
- Message Broker RabbitMQ
- Workers in NodeJS
- Elastic search and Kibana
- Admin server in NodeJS
- HTML, JS and Bootstrap to create the web interfaces


<!--
<img src="newschema.png" width="800"> 
-->
<img src="https://lh3.googleusercontent.com/d/1q5JnkuTBy4Vqy0xRsl7eiPvuR5x0gICO">
