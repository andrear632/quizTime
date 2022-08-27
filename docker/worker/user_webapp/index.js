let socket = new WebSocket("ws://localhost:8081/ws");

socket.onopen = function(e) {
    alert("[open] Connessione stabilita");
    socket.send("Il mio nome è John");
    socket.send("ping");
};

socket.onmessage = function(event) {
    if (event.data == "pong") {
        setTimeout(function() {
            socket.send("ping");
        }, 20000)
    }
    else {
        alert(`[message] Ricezione dati dal server: ${event.data}`);
    }
};

socket.onclose = function(event) {
    if (event.wasClean) {
        alert(`[close] Connessione chiusa con successo, code=${event.code} reason=${event.reason}`);
    } else {
        // e.g. processo del server terminato o connessione già
        // in questo caso event.code solitamente è 1006
        alert('[close] Connection morta.');
    }
};

socket.onerror = function(error) {
    alert('Connection closed');
};