const express = require('express');
const path = require('path');
const http = require ('http');
const socketio = require ('socket.io');

const app = express();
const server =http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// RUn when client connects
io.on('connection', socket => { 
    console.log('New WS connection.....');
    socket.emit('message', 'Welcome to Chateau');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));