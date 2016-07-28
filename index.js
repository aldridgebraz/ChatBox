var express = require("express");
var app = express();

var http = require("http").Server(app);

var io = require("socket.io")(http);

app.use(express.static(__dirname + "/public"));

app.use(express.static(__dirname + "/node_modules"));

app.get("/", function(req, res) {
	res.sendFile("index.html");
});

io.on("connection", function(socket) {
	console.log("A user connected");
	socket.on("chat message", function (msg) {
		console.log("message: " + msg);
	});
	socket.on("disconnect", function() {
		console.log("User disconnected");
	});
});

http.listen(3000, function() {
	console.log("Listening on port 3000");
});