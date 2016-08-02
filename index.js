var express = require("express");
var app = express();

var http = require("http").Server(app);

var io = require("socket.io")(http);

var user_list = null;

function User(name, id) {
	this.username = name;
	this.id = id;
	this.next = null;
}

function add_user(user_node) {
	if (user_list == null) {
		user_list = user_node;
	}
	else {
		user_node.next = user_list;
		user_list = user_node;
	}
}

function remove_user(id) {
	var prev = null;
	var current = user_list;
	while (current != null) {
		if (id == current.id) {
			if (current == user_list) {
				user_list = current.next;
				current.next = null;
				return current.username;
			}
			else {
				prev = current.next;
				current.next = null;
				return current.username;
			}
		}
		prev = current;
		current = current.next;
	}
	return null;
}


app.use(express.static(__dirname + "/public"));

app.use(express.static(__dirname + "/node_modules"));

app.get("/", function(req, res) {
	res.sendFile("index.html");
});

io.on("connection", function(socket) {
	console.log("A user connected");

	socket.on("new user", function(username) {
		
		console.log("username: " + username);
		console.log("socket.id: " + socket.id);
		
		var new_user = new User(username, socket.id);
		
		socket.broadcast.emit("new user", username);
		
		
		add_user(new_user);
	});
	
	socket.on("chat message", function (msg) {
		console.log("message: " + msg);
		socket.broadcast.emit("chat message", msg);
	});
	
	socket.on("disconnect", function() {
		console.log("User disconnected");
		var username = remove_user(socket.id);
		
		console.log("username: " + username);
		console.log("socket.id: " + socket.id);
		
		io.emit("user left", username);
	});
	
	socket.on("user typing", function(user) {
		socket.broadcast.emit("user typing", user);

	});
	
});

http.listen(3000, function() {
	console.log("Listening on port 3000");
});
