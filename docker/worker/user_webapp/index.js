let socket = new WebSocket("ws://localhost:8081/");

socket.onopen = function(e) {
  alert("[open] Connessione stabilita");
  alert("Invio al server");
  socket.send("Il mio nome è John");
};

socket.onmessage = function(event) {
  alert(`[message] Ricezione dati dal server: ${event.data}`);
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
  alert(`[error] ${error.message}`);
};