const express = require('express');
const path = require('path');
const http = require ('http');
const socketio = require ('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeaves, getRoomUsers} = require('./utils/users')

const app = express();
const server =http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'JARVIS(Bot)';

// RUn when client connects
io.on('connection', socket => { 
socket.on('joinroom', ({username, room}) => {
    const user= userJoin(socket.id, username, room);
    socket.join(user.room);

    //Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to Chateau'));

    //Broadcast when a user connects
    socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

    //Send users and room info
    io.to(user.room).emit('roomUsers',{
        room: user.room,
        users: getRoomUsers(user.room)
    });
});

    //Listen for chat message
    socket.on('chatMessage', (msg) =>
    {   
        const user = getCurrentUser(socket.id)
        //to send to consolelog
        //console.log(msg);

        // to send to every client and server
        io.to(user.room).emit('message',formatMessage(user.username, msg));
    });
    //Runs when a client disconnects
    socket.on('disconnect', ()=>{
        const user = userLeaves(socket.id);
        if(user){
        io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
    //Send users and room info
    io.to(user.room).emit('roomUsers',{
        room: user.room,
        users: getRoomUsers(user.room)
    });
    }
});
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
