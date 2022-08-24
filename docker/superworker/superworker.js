for(var i = 0; i< 10; i++){console.log(i)}
// const fetch = require('node-fetch');
// const request = require('request');
// const nodemailer = require('nodemailer');
// require('dotenv').config({ path: '.env' });
// const fs = require('fs');
// const https = require('https');
// const privateKey = fs.readFileSync('./openssl/server.key', 'utf8');
// const certificate = fs.readFileSync('./openssl/server.crt', 'utf8');
// const credentials = { key: privateKey, cert: certificate };
// const express = require('express');


// //moduli creati da noi
// const logger = require('./logger_functions');


// var app = express();
// app.use(express.json());

// //
// var bodyParser = require("body-parser");
// app.use(bodyParser.urlencoded({ extended: false }));


// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// //implementazione da testare

// var config = fs.readFileSync("config.json");
// var parsed_config = JSON.parse(config);
// var NUM_OF_PLACES = parsed_config.NUM_OF_PLACES;
// var MAP_SERVICES_NAME = parsed_config.MAP_SERVICES_NAME;
// var list_cities = parsed_config.list_of_cities;
// var default_city = parsed_config.default_city;
// var keyfromconfig = parsed_config.chiave;


// function error_handler(error, sender_ip, response) {

//     if (typeof error[0] != 'undefined') {
//         var obj = {
//             'Generated By': error[1],
//             'Error Status': error[0].status,
//             'Error Status Text': error[0].statusText
//         }

//         logger.producer("[ERRORE][" + error[1] + "] Ottenuto: " + error[0].status + " " + error[0].statusText + " per la richiesta di " + sender_ip + ";")

//         if (error[0].status == 'Sconosciuto' || error[0].statusText == 'Sconosciuto') {
//             response.status(500).send(JSON.stringify({ "service_status": "UNKNOWN" }));
//         } else {

//             response.status(error[0].status).send(obj);

//         }

//     } else {
//         //console.log('CASO SPECIALE');
//         logger.producer('[CASO SPECIALE];') 
//         response.send(JSON.stringify({ "service_status": "FAIL_TO_LOCATE" }));
//     }

// }

// //Definizione di tutte le funzioni che verranno richiamate dopo
// function extract(json_obj, number, origin) { //versione che permette di scegliere solo un tot numero di posti
//     var location_array = [];
//     var location_list = json_obj.lista;

//     var requested;

//     if ((typeof number == 'undefined') || number > location_list.length) { //controllo anche il caso in cui i numeri richiesti siano superiori a quelli disponibili 
//         requested = location_list.length;
//     } else {
//         requested = number;
//     }

//     for (var i = 0; i < location_list.length; i++) {//creo array base 
//         location_array.push([location_list[i].name, parseFloat(location_list[i].lat), parseFloat(location_list[i].long), location_list[i].via])
//     }

//     if(requested != location_list.length){ //gestisco il caso in cui mi venga dato un numero limite
//         var sorted = sorter(location_array)
//         var position; //indice da dove iniziare a prendere elementi che poi restituisco
//         var result = [];

//         //faccio stima di vicinaza al punto considerando la latitudine

//         if(origin>sorted[sorted.length-1][1]){ //se lat di origin maggiore allora prendo sicuramente gli ultimi number luoghi
//             position = sorted.length
//             for(var i = 0; i<number; i++){
//                 result.push(sorted[position-i]);
//             }
//             return result;
//         }

//         if(origin<sorted[0]){ //se lat di origin maggiore allora prendo sicuramente i primi number luoghi
//             position = 0;
//             for(var i=0; i<number; i++){
//                 result.push(sorted[position+i]);
//             }
//             return result;
//         }

//         for(var i = 0; i<sorted.length; i++){ // se lat di origin è "in mezzo" alle lat dei luoghi trovo la position da cui partire
//             if(sorted[i][1]>origin){
//                 position = i;
//                 break;
//             }
//         }

//         for(var i=0; i<((number/2));i++){ //trovata la posizione prelevo i luoghi più vicini uno a dx l'altro a sx
            
//             if(position+i<location_list.length){
//                 result.push(location_array[position+i])
//             }
//             if(position-i>0 && position-i-1>=0){
//                 result.push(location_array[position-i-1])
//             }
//         }
        
//         result = sorter(result) //li riorganizzo in modo che poi posso eliminare il più lontano
        
//         if(result.length>number){ //se l'array risultato supera il valore richiesto elimino l'ultimo luogo
//             result.pop();           //(non supererà mai più di 1 perchè vanno a coppie)
//         }

//         return result;

//     }

//     return location_array;
// }

// function distance(lat1, lon1, lat2, lon2) {
//     if ((lat1 == lat2) && (lon1 == lon2)) { return 0; } else {
//         var rLat1 = Math.PI * lat1 / 180
//         var rLat2 = Math.PI * lat2 / 180
//         var theta = lon1 - lon2
//         var rTheta = Math.PI * theta / 180
//         var distance = Math.sin(rLat1) * Math.sin(rLat2) + Math.cos(rLat1) * Math.cos(rLat2) * Math.cos(rTheta);

//         if (distance > 1) {
//             distance = 1;
//         }
//         distance = Math.acos(distance);
//         distance = distance * 180 / Math.PI;
//         distance = distance * 60 * 1.1515;
//         distance = distance * 1.609344;

//         //Approssima alla terza cifra decimale così km --> m 
//         return Math.round(distance * 1000) / 1000
//     }
// }

// function from_point_to_location(res, latP, longP) {

//     var location_array = []

//     for (var i = 0; i < res.length; i++) {
//         //Formato array: [nome_luogo, distanza, lat, lng]
//         location_array.push([res[i][0], distance(latP, longP, res[i][1], res[i][2]), res[i][1], res[i][2], res[i][3]]);
//     }

//     return location_array;
// }

// function sorter(array) {
//     return array.sort(function(a, b) { return a[1].toString().localeCompare(b[1]); })
// }

// function turn_into_json_1(body, lat, long) { 

//     var template = {
//         "service_status": "OK",
//         "user": [lat, long],
//         "destinations": body,
//     }

//     return template;

// }

// function turn_into_json_2(dmatrix_response, origin, destinations_array) {

//     var json_result = {
//         service_status: "OK",
//         start: '',
//         destinations: [

//         ]
//     }

//     json_result.start = origin.reverse();

//     for (var i = 0; i < destinations_array.length; i++) {
//         var distance = dmatrix_response.distances[0][i];
//         var time = dmatrix_response.times[0][i];
//         json_result.destinations.push([destinations_array[i].slice(1, 3), distance, time, destinations_array[i][0], destinations_array[i][3]]);
//     }

//     return json_result;
// }


// //sistemo il payload per la post
// function turn_into_post_payload(origin, destinations, vehicle) {

//     var from_to_details = {
//         "from_points": [],
//         "to_points": [],
//         "out_arrays": [
//             "times",
//             "distances"
//         ],
//         "vehicle": ""
//     };

//     from_to_details.from_points.push(origin);

//     from_to_details.vehicle = vehicle;

//     for (var i = 0; i < destinations.length; i++) {
//         from_to_details.to_points.push(destinations[i])
//     }

//     var final_post_options = {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(from_to_details)

//     }

//     return final_post_options;

// }

// //setup per la post

// function post_setup(response_json) {
//     var info = response_json;
//     var origin = info.user;

//     var destinations_array = info.destinations;
//     var final_objectives = [];

//     for (var i = 0; i < NUM_OF_PLACES; i++) {
//         final_objectives.push([destinations_array[i][0], destinations_array[i][2], destinations_array[i][3], destinations_array[i][4]]);

//     };

//     return [origin, final_objectives];

// }


// //chiamata alla direction matrix
// async function direction_matrix_call(setup) {

//     var check = false;  
//     var temp; 

//     var result = await fetch('https://graphhopper.com/api/1/matrix?&key=' + process.env.GRAPHHOPPER_KEY, setup)
//         .then(res => {

//             if (!res.ok) {
//                 throw [res.status, res.statusText];
//             }

//             return res.json();
//             car
//         })
//         .then(end => { return end })
//         .catch(err => {
//             check = true;
//             temp = err;
//         });

//     if (check) {
//         console.log("Errore");
//         result = ['ERRORE', temp[0], temp[1]];
//         console.log(temp);
//     }

//     return result;
// }

// function check_vehicle(vehicle) {
//     if (typeof vehicle == 'undefined') {
//         return 'car';
//     } else if (vehicle == 'car' || vehicle == 'foot' || vehicle == 'bike') {
//         return vehicle;
//     } else {
//         return 'car';
//     }
// }

// function check_city(city) {
//     if (typeof city != 'undefined') {
//         if (list_cities.includes(city.toLowerCase())) {
//             return city.toLowerCase();
//         }
//     }

//     return default_city;
// }


// //Funzioni per i Log

// function getSeconds(time) {
//     var splitString = time.split(' ');
//     var splitime = splitString[0].split(':');
//     var seconds = parseInt(splitime[0]) * 60 * 60 + parseInt(splitime[1] * 60) + parseInt(splitime[2])

//     if (time.includes("PM")) {
//         seconds += 12 * 60 * 60;
//     }

//     return seconds
// }

// function inFormaAMPM(time) {
//     var splitString = time.split(':');
//     if (parseInt(splitString[0]) > 12) {
//         splitString[0] = parseInt(splitString[0]) - 12;
//         return splitString.join(':') + " PM"
//     } else {
//         return time + " AM"
//     }

// }



// //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// //APP API initialize serve
// //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// app.get('/general', function(req, response_api) { 
//     response_api.setHeader('Access-Control-Allow-Origin', '*');
//     console.log('HO RICEVUTO ' + req.query.address);
//     var location_not_formatted = req.query.address;
//     var location = location_not_formatted.split(" ").join('+');

//     var number = req.query.tot; //possibilità di scegliere meno posti
//     var city = check_city((req.query.città));

//     logger.producer('[RICHIESTA-GENERAL] Da ' + req.ip + ' con i sequenti parametri: ' + location_not_formatted + ', ' + number + ";");

//     var options = {
//         url: 'https://graphhopper.com/api/1/geocode?q=' + location + '&locale=it&debug=true&limit=1&key=' + process.env.GRAPHHOPPER_KEY,
//     }

//     function callback_api_request(error, response, body) {
//         if (!error && response.statusCode == 200) {
//             //Se è andato tutto bene nella chiamata rest formatto 
//             var info_location_api = JSON.parse(body);

//             //Gestione errore: indirizzo non trovato
//             //La chiamata è andata bene ma graphhopper non riesce a localizzare l'utente
//             if (info_location_api.hits == '') { 
//                 //console.log('Gestione errore: indirizzo non trovato');
//                 logger.producer('[CASO SPECIALE];') 
//                 response_api.send(JSON.stringify({ "service_status": "FAIL_TO_LOCATE" }));


//             }
//             //Se invece è andato tutto bene e ho trvato indirizzo, procevo
//             //Interpello db, calcolo distanze, restituisco json
//             else {
//                 var lat_user = info_location_api.hits[0].point.lat;
//                 var lng_user = info_location_api.hits[0].point.lng;
//                 fetch('http://admin:admin@couchdb:5984/' + city + '/listacitta')
//                     .then(res => {
//                         if (!res.ok) {
//                             throw [res, DB_NAME];
//                         } else {
//                             return res.json();
//                         }
//                     })
//                     .then(res => { return extract(res, number, lat_user) })
//                     .then(res => { return from_point_to_location(res, lat_user, lng_user) })
//                     .then(res => { return sorter(res) })
//                     .then(res => { return turn_into_json_1(res, lat_user, lng_user) })
//                     .then(end => {
//                         console.log("Fine del Fetch");
//                         response_api.send(JSON.stringify(end));

//                         logger.producer('[SUCCESS-GENERAL]Elaborazione e Invio Dati completato;')

//                     })
//                     .catch(error => { error_handler(error, req.ip, response_api) });
//             }
//         } else {

//             var err_obj = {
//                 status: '',
//                 statusText: ''
//             }

//             if (typeof response == 'undefined') {
//                 err_obj.status = 'Sconosciuto';
//                 err_obj.statusText = 'Sconosciuto';
//             } else if (typeof response.statusCode == 'undefined' || typeof response.statusMessage == 'undefined') {
//                 err_obj.status = 'Sconosciuto';
//                 err_obj.statusText = 'Sconosciuto';
//             } else {
//                 err_obj.status = response.statusCode;
//                 err_obj.statusText = response.statusMessage;
//             }



//             var err_elems = [err_obj, MAP_SERVICES_NAME];

//             error_handler(err_elems, req.ip, response_api);
//         }
//     }

//     request.get(options, callback_api_request);

// });



// app.post('/specific', function(request, response_api) {
//     response_api.setHeader('Access-Control-Allow-Origin', '*');
//     console.log('HO RICEVUTO DA AJAX => ' + request.body.address);
//     var location_not_formatted = request.body.address;
//     var location = location_not_formatted.split(" ").join('+');
//     var vehicle = check_vehicle(request.body.vehicle)
//     var city = check_city((request.body.citta));

//     var origin;
//     var destinations;

//     logger.producer('[RICHIESTA SPECIFIC] Da ' + request.ip + ' con i sequenti parametri: ' + location_not_formatted + ', ' + vehicle + ', ' + city + ';');

//     fetch('https://localhost:3000/general?address=' + location + '&citta=' + city)
//         .then(res => {
//             return res.json();
//         })
//         .then(res => { return post_setup(res) })
//         .then(res => { 

//             origin = res[0];
//             destinations = res[1];

//             var dest_correct_order = []
//             for (var i = 0; i < res[1].length; i++) {
//                 dest_correct_order.push(res[1][i].slice(1, 3).reverse());
//             }

//             return turn_into_post_payload(res[0].reverse(), dest_correct_order, vehicle)

//         })
//         .then(res => { return direction_matrix_call(res) })
//         .then(res => {
//             if (res[0] == 'ERRORE') { //questo è il controllo dell'errore

//                 var obj = {
//                     status: '',
//                     statusText: ''
//                 }

//                 obj.status = res[1];
//                 obj.statusText = res[2];

//                 throw [obj, MAP_SERVICES_NAME];
//             }
//             return turn_into_json_2(res, origin, destinations)
//         })
//         .then(res => {
//             console.log("FINE DI TUTTO")
//             response_api.send(res)
//             logger.producer('[SUCCESS-SPECIFIC] Richiesta da ' + request.ip + ' completata con succeso;');
//         })
//         .catch(err => {
//             error_handler(err, request.ip, response_api)
//         });


// });



// var access_tok = '';

// app.get('/gcalendar/login', function(req, res) {

//     let secret;

//     try {
//         secret = fs.readFileSync('secrets.json'); 
//     } catch (error) {
//         console.log(error);

//         var err_obj = {
//             status: '500',
//             statusText: 'Internal Server Error -->' + error
//         }

//         var er = [err_obj, 'GCALENDAR SECRET'];
//         error_handler(er, req.ip, res);
//         return;
//     }

//     let sec_json = JSON.parse(secret);
//     client_id = sec_json.web.client_id;
//     client_secret = sec_json.web.client_secret;
//     red_uri = sec_json.web.redirect_uris[0];

//     let state_obj = {
//         id: req.query.id,
//         data: req.query.data,
//         indirizzo: req.query.indirizzo,
//         nomeLuogo: req.query.nomeLuogo,
//         nomeLibro: req.query.nomeLibro,
//         autore: req.query.autore
//     }

//     logger.producer("[GCALENDAR]Ricevuta richiesta per aggiunta evento da " + req.ip + ";");

//     res.redirect("https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/calendar&response_type=code&include_granted_scopes=true&state=" + JSON.stringify(state_obj) + "&redirect_uri=" + red_uri + "&client_id=" + client_id);
// });



// app.get('/gcalendar', function(req, res) {

//     let state_obj = req.query.state;


//     var formData = {
//         code: req.query.code,
//         client_id: client_id,
//         client_secret: client_secret,
//         redirect_uri: red_uri,
//         grant_type: 'authorization_code'
//     }

//     request.post({ url: 'https://www.googleapis.com/oauth2/v4/token', form: formData }, function optionalCallback(err, httpResponse, body) {
//         if (err) {
//             //return console.error('upload failed:', err);

//             var err_details = {
//                 status: '500',
//                 statusText: 'Internal Server Error'
//             }

//             var err_obj = [err_details, 'GCALENDAR-FAILED-TO-GET-TOKEN'];

//             error_handler(err_obj, req.ip, res);
//             return;

//         }
//         var info = JSON.parse(body);
//         access_tok = info.access_token;
//         if (access_tok != undefined || access_tok == '') { //Già loggato, lo uso.
//             res.redirect('/gcalendar/use_token?access_tok=' + access_tok + '&state=' + state_obj);
//         } else { //Non loggato o token scaduto, provvedo.
//             res.redirect('/gcalendar/login');
//         }
//     });
// });


// app.get('/gcalendar/use_token', function(req, res) {
//     var access_token_get = req.query.access_tok;
//     var event_parameter = JSON.parse(req.query.state);

//     //console.log(access_token_get);
//     //console.log(event_parameter);

//     var ID = event_parameter.id
//     var DataRitiro = event_parameter.data;
//     var Indirizzo = event_parameter.indirizzo;
//     var Autore = event_parameter.autore;
//     var Luogo = event_parameter.nomeLuogo;
//     var Libro = event_parameter.nomeLibro;

//     var event = {
//         summary: 'Ritira Libro presso ' + Luogo,
//         location: Indirizzo,
//         description: 'Recati a ' + Luogo + ' in ' + Indirizzo + ' e usa il CODICE: ' + ID + ' per ritirare la copia di "' + Libro + '" - ' + Autore + ' da te prenotata.',
//         start: {
//             dateTime: DataRitiro + 'T09:00:00',
//             timeZone: 'Europe/Rome',
//         },
//         end: {
//             dateTime: DataRitiro + 'T17:00:00',
//             timeZone: 'Europe/Rome',
//         },
//         reminders: {
//             useDefault: false,
//             overrides: [
//                 { method: 'email', minutes: 1440 },
//                 { method: 'popup', minutes: 1440 },
//             ],
//         },
//     }

//     console.log(event);
//     var options = {
//         url: 'https://www.googleapis.com/calendar/v3/calendars/primary/events ',
//         method: 'POST',
//         headers: {
//             'Authorization': 'Bearer ' + access_token_get,
//             'content-type': 'application/json'
//         },
//         body: JSON.stringify(event)
//     };

//     request(options, function callback(error, response, body) {
//         if (!error && response.statusCode == 200) {
//             var info = JSON.parse(body);
//             console.log(info);
//             logger.producer("[SUCCESS-GCALENDAR]Evento Salvato per ID:" + ID + ";");
//             res.send("<script type='text/javascript'>window.open('','_self'); alert('Evento salvato con successo.'); window.close(); </script>");
//         } else {
//             var err_details = {
//                 status: '500',
//                 statusText: 'Internal Server Error'
//             }

//             var err_obj = [err_details, 'GCALENDAR'];

//             error_handler(err_obj, req.ip, res);
//             return;
//         }
//     });
// });


// app.post('/sendmail', function(request, response) {

//     response.setHeader('Access-Control-Allow-Origin', '*');

//     var ID = request.body.id;
//     var DataRitiro = (request.body.data).split('-').reverse().join('/');
//     var Indirizzo = request.body.indirizzo;
//     var Autore = request.body.autore;
//     var Luogo = request.body.nomeLuogo;
//     var Libro = request.body.nomeLibro;
//     var Email = request.body.email;

//     logger.producer("[MAIL] Richista di Invio Mail da" + request.ip + " per l'ID:" + ID + ";");


//     var html_template = "<img src='cid:immagine' align='left' width='75%'/>'" +
//         "<img src='https://api.qrserver.com/v1/create-qr-code/?size=84x84&data=" + ID + "' align='right'/> <br><br><br><br>" +
//         "<h1><b> Ricevuta di Prenotazione</b></h1>" +
//         "<b>Codice Prenotazione:</b> " + ID + "<br>" +
//         "<hr><br>" +
//         "<b>Libro:</b> " + Libro + " di " + Autore + "<br>" +
//         "<hr><br>" +
//         "<b>Luogo del Ritiro:</b> " + Luogo + " in " + Indirizzo + "<br>" +
//         "<hr><br>" +
//         "<b>Data Ritiro:</b> " + DataRitiro;

//     var transporter = nodemailer.createTransport({
//         host: "smtp.gmail.com",
//         port: 587,
//         secure: false,
//         auth: {
//             user: process.env.EMAIL_SENDER,
//             pass: process.env.PSW_SENDER,
//         },
//         tls: {
//             rejectUnauthorized: false
//         }
//     });

//     var mailOptions = {
//         from: process.env.EMAIL_SENDER,
//         to: Email,
//         subject: 'Prenotazione BOOKed',
//         html: html_template,
//         attachments: [{
//             filename: 'image.png',
//             path: 'BOOKed.png',
//             cid: 'immagine'
//         }]
//     };

//     transporter.sendMail(mailOptions, function(error, info) {
//         if (error) {
//             console.log(error)
//             logger.producer("[ERRORE][Mail] Impossibile inviare mail per l'ID:" + ID + ";");
//             response.send(JSON.stringify('{"status": "FAILED"}'));
//         } else {
//             logger.producer("[MAIL-SUCCESS] Inviata con successo Mail per l'ID:" + ID + ";");
//             response.send(JSON.stringify('{"status": "OK"}'));
//             //console.log('Email sent: ' + info.response); //risposta in json da definire
//         }
//     });

// });


// app.get('/getLog', function(request, response) {

//     var mk = request.query.masterkey;

//     if (typeof mk == 'undefined' || mk != keyfromconfig) {
//         response.status(401).send(JSON.stringify({ "service_status": "Unauthorized" }));
//         return
//     }

//     response.setHeader('Access-Control-Allow-Origin', '*');

//     var path = "./share_folder/"; 

//     var data = request.query.data;
//     var da = request.query.da;
//     var a = request.query.a;

//     var daSeconds;
//     var aSeconds;

//     if (typeof da == 'undefined') {
//         da = '00:00:00 AM';
//     } else {
//         da = inFormaAMPM(da);
//     }

//     if (typeof a == 'undefined') {
//         a = '11:59:59 PM'
//     } else {
//         a = inFormaAMPM(a);
//     }

//     daSeconds = getSeconds(da);
//     aSeconds = getSeconds(a);

//         /*console.log(daSeconds);
//         console.log(aSeconds); */ 

//     if (typeof data == 'undefined') {
//         d = new Date()
//         data = d.toLocaleDateString();
//         data = data.split("/").reverse();
//         data = data.join('_');
//     }
//     else{
//         data = data.split("/").reverse();
//         var t = [data[1], data[2]].reverse();
//         data[1] = t[0];
//         data[2] = t[1];
//         data = data.join('_');
//     }

//     var log_path = path + data + '.log'

//     fs.readFile(log_path, 'utf8', (err, data) => {
//         if (err) {
//             response.status(500).send({
//                 error: err
//             })
//         } else {
//             var res = [];
//             var t = data.split('\n')

//             t.forEach(line => {

//                 var time = getSeconds(line.substring(0, 10))
//                     //console.log(time)
//                 if (aSeconds > time && daSeconds <= time) {
//                     res.push(line);
//                 }

//             })

//             response.status(200).send({
//                 log: res
//             })
//         }
//     })

// });




// var httpsServer = https.createServer(credentials, app);

// const server = httpsServer.listen(3000, function() {
//     console.log("In Ascolto sulla Porta 3000"); //ne necessito per capire quando il server è partito
// });

// process.on('SIGTERM', () => { //rilevo il SIGTERM
//     server.close(() => { //chiudo il server
//         process.exit(0); //termino il processo
//     });

// });


// //var httpsServer = https.createServer(credentials, app);
// //httpsServer.listen(3000);
