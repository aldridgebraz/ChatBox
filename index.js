var express = require("express");
var app = express();

var http = require("http").Server(app);

var io = require("socket.io")(http);

app.use(express.static(__dirname + "/public"));

app.use(express.static(__dirname + "/node_modules"));

app.get("/", function(req, res) {
	res.sendFile("index.html");
});

app.get("\/.*\.js", function(req, res) {
	console.log("WE HERE");
	res.redirect("/");
});

io.on("connection", function(socket) {
	console.log("A user connected");
});

http.listen(3000, function() {
	console.log("Listening on port 3000");
});