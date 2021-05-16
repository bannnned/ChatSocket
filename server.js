const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.json());

const rooms = new Map();

/* Saving users and messages */
app.get('/rooms/:id', (req, res) => {
  const { id: roomId } = req.params;
  const obj = rooms.has(roomId)
    ? {
        users: [...rooms.get(roomId).get('users').values()],
        messages: [...rooms.get(roomId).get('messages').values()],
      }
    : { users: [], messages: [] };
  res.json(obj);
});

/*  */
app.post('/rooms', (req, res) => {
  const { roomId, userName } = req.body;
  if (!rooms.has(roomId)) {
    rooms.set(
      roomId,
      new Map([
        ['users', new Map()],
        ['messages', []],
      ]),
    );
  }
  res.send();
});

/* Tracking client data in socket */
io.on('connection', (socket) => {
  /* When user is connect get his name and room id */
  socket.on('ROOM:JOIN', ({ roomId, userName }) => {
    socket.join(roomId);
    rooms.get(roomId).get('users').set(socket.id, userName);
    /* Get users names and send socket to all users in the room */
    const users = [...rooms.get(roomId).get('users').values()];
    socket.to(roomId).emit('ROOM:SET_USERS', users);
  });


/* Sending and tracking new message */
  socket.on('ROOM:NEW_MESSAGE', ({ roomId, userName, text }) => {
    const obj = {
      userName,
      text,
    };
    rooms.get(roomId).get('messages').push(obj);
    socket.to(roomId).emit('ROOM:NEW_MESSAGE', obj);
  });

/* Disconnecting user after he leaves */
  socket.on('disconnect', () => {
    rooms.forEach((value, roomId) => {
      if (value.get('users').delete(socket.id)) {
        const users = [...value.get('users').values()];
        socket.to(roomId).emit('ROOM:SET_USERS', users);
      }
    });
  });
  console.log('user connected', socket.id);
});

/* Listening server */
server.listen(8888, (err) => {
  if (err) {
    throw Error(err);
  }
  console.log('Сервер запущен!');
});
