var socket;
var nickname;
var id;
var qn;

function openws(){
    socket = new WebSocket("ws://localhost:8081/ws");

    socket.onopen = function(e) {
        nickname = document.getElementById("nick").value;
        localStorage["nickname"] = nickname
        socket.send("nickname: " + nickname);
        socket.send("ping");
        document.getElementById("score").hidden = true;
        document.getElementById("nickname").hidden = true;
        document.getElementById("buttons").hidden = true;
        document.getElementById("loading").hidden = false;
    };
    
    socket.onmessage = function(event) {
        msg = event.data;
        if (msg == "pong") {
            setTimeout(function() {
                socket.send("ping");
            }, 20000)
        }
        else if (msg.startsWith("id: ")) {
            id = msg.substring(4, 10);
            localStorage["id"] = id;
    
        }
        else if (msg.startsWith("qn: ")) {
            qn = msg.substring(4);
            document.getElementById("loading").hidden = true;
            document.getElementById("score").hidden = true;
            document.getElementById("nickname").hidden = true;
            document.getElementById("buttons").hidden = false;
            setTimeout(function() {
                document.getElementById("score").hidden = true;
                document.getElementById("nickname").hidden = true;
                document.getElementById("buttons").hidden = true;
                document.getElementById("loading").hidden = false;
            }, 10000)
        }
        else if (msg.startsWith("end: ")) {
            document.getElementById('rank').textContent = msg.substring(5);
            document.getElementById("nickname").hidden = true;
            document.getElementById("buttons").hidden = true;
            document.getElementById("loading").hidden = true;
            document.getElementById("score").hidden = false;
        }
        else {
            alert("Unknown message received");
        }
    };
    
    socket.onclose = function(event) {
        if (event.wasClean) {
            document.getElementById("buttons").hidden = true;
            document.getElementById("loading").hidden = true;
            document.getElementById("score").hidden = true;
            document.getElementById("nickname").hidden = false;
            alert('Thanks for playing with us!')
        } else {
            document.getElementById("buttons").hidden = true;
            document.getElementById("loading").hidden = true;
            document.getElementById("score").hidden = true;
            document.getElementById("nickname").hidden = false;
            alert('Unexpected error');
        }
    };
    
    socket.onerror = function(error) {
        document.getElementById("buttons").hidden = true;
        document.getElementById("loading").hidden = true;
        document.getElementById("score").hidden = true;
        document.getElementById("nickname").hidden = false;
        alert('Unexpected error');
    };
}

function send(letter){
    socket.send("qn: "+qn+", ans: "+letter+", id: "+ localStorage["id"]);
    document.getElementById("score").hidden = true;
    document.getElementById("nickname").hidden = true;
    document.getElementById("buttons").hidden = true;
    document.getElementById("loading").hidden = false;
}