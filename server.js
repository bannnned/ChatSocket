const express = require('express');

const app = express();
const server = require('http').createServer(app)
const io = require('socket.io')(server,{cors:{origin:"*"}})


const rooms = new Map();

app.get('/rooms', (req, res) => {
    res.json(rooms);

})

io.on('connection', socket => {
    console.log('Socket connected', socket.id);
})

server.listen(8888, (err) => {
    if (err) {throw Error(err)}
    console.log('Server is on')
})