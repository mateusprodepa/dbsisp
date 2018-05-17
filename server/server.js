const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const express = require("express");
const socket = require("socket.io");
const http = require("http");

const readers = require("./utils/loaders.js");

const app = express();
const server = http.createServer(app);
const io = socket(server);


const PUBLIC_PATH = path.join(__dirname + "/../public");
const PORT = process.env.PORT || 3000;

app.use(express.static(PUBLIC_PATH));
app.use(morgan("dev"));


const FILE_LOCAL = path.join(__dirname + "/filtrados-apache-error.log");
let ERROR_LOGS = [];


io.on("connection", socket => {
	console.log("Um usuário foi conectado...");
	loadLogs("http://10.1.13.27/logsisp/sisp2-minuto-access.log", socket);
	setInterval(() => {
		loadLogs("http://10.1.13.27/logsisp/sisp2-minuto-access.log", socket);
	}, 10000);
});

function loadLogs(url, socket) {
	readers.readLogsFromPage(url, "POST", logs => {
		try {
			socket.emit("logs", logs);
			socket.emit("log-qtd", `Quantidade de erros encontrados: ${logs.length}`);
			if(typeof logs === "string") throw logs;
		} catch(err) {
			console.log(err);
		}
	});
};

server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

// const found = l.input.search(/\bhttps:\/\/www+\w*\b.*\/$/);
// const url = l.input.search(/\bhttps:\/\/www+\w*\b.*?\s/);
