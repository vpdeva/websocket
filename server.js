const express = require('express');
const WebSocket = require('ws');
var url = require('url');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws,req){

	const parameters = url.parse(req.url,true);

	ws.message_group_id = parameters.query.message_group_id;

	ws.on('open', function(data) {
		console.log("New Connection");
	});

	ws.on('message', function incoming(data) {
		wss.clients.forEach(function each(client) {
			if(client.message_group_id == ws.message_group_id && client.readyState === WebSocket.OPEN) {
				console.log(data);
				client.send(data);
			}
		});
	});

	ws.on('close', function(reasonCode, description) {
		console.log('Client has disconnected.'+reasonCode+" -- "+description);
		ws.close();
	});

});