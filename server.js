var express = require("express");
var path = require("path");
var app = express();

var chatlog = [];
var users = [];
// static content (disabled)
//app.use(express.static(path.join(__dirname, "./static")));

// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// root route to render the index.ejs view
app.get('/', function(req, res) {
 res.render("index");
})

var server = app.listen(8000, function() {
 console.log("listening on port 8000");
})

var io = require('socket.io').listen(server);



io.sockets.on('connection', function (socket) {
  console.log('Socket ID:',socket.id);
 
 	socket.on("new_text", function (data){
		
		chatlog.push(data.name + ' says: ' + data.text);
		io.emit('update_chat', {clog : chatlog});
		console.log(users);
	})

 	socket.on("new_user", function(clientData){
 		clientData.socket_id = socket.id;
 		users.push(clientData);
 		chatlog.push(clientData.name + ' has joined the chat');
 		socket.emit('get_chat', {clog : chatlog, chat_users: users});
 		socket.broadcast.emit('update_chat', {clog : chatlog});
 	})
	
socket.on('disconnect', function(){
        console.log('something d/c', socket.id);
        
        for(index in users){
        	if(socket.id == users[index].socket_id){
        		chatlog.push(users[index].name + ' has left the chat');
        		users.splice(index,1);
        		break;
        	}
        }
        io.emit('update_chat', {clog : chatlog});
        //io.emit update users
    })










})
