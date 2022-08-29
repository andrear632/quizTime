var socket;
var nickname;
var id;
var qn;
var res;

function init(){
    if (localStorage.hasOwnProperty('id')){
        document.getElementById("nick").value = localStorage['id']
    }
}

function openws(){
    socket = new WebSocket("ws://localhost:8081/ws");

    socket.onopen = function(e) {
        nickname = document.getElementById("nick").value;
        localStorage["nickname"] = nickname
        res = {'nickname':nickname}
        socket.send(JSON.stringify(res));
        res = {'ping':true}
        socket.send(JSON.stringify(res));
        document.getElementById("score").hidden = true;
        document.getElementById("nickname").hidden = true;
        document.getElementById("buttons").hidden = true;
        document.getElementById("loading").hidden = false;
    };
    
    socket.onmessage = function(event) {
        msg = JSON.parse(event.data);
        if (msg.hasOwnProperty('pong')) {
            setTimeout(function() {
                res = {'ping':true}
                socket.send(JSON.stringify(res));
            }, 20000)
        }
        else if (msg.hasOwnProperty('id')) {
            id = msg.id;
            localStorage["id"] = id;
    
        }
        else if (msg.hasOwnProperty('qn')) {
            qn = msg.qn;
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
        else if (msg.hasOwnProperty('end')) {
            document.getElementById('rank').textContent = msg.end;
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
    res = {'qn': qn, 'ans': letter, 'id': localStorage['id']}
    socket.send(JSON.stringify(res));
    document.getElementById("score").hidden = true;
    document.getElementById("nickname").hidden = true;
    document.getElementById("buttons").hidden = true;
    document.getElementById("loading").hidden = false;
}