require
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());

app.get('/', (req, res) => {
  res.send('SIM Bridge Relay Server is Active!');
});

io.on('connection', (socket) => {
  console.log('ডিভাইস সংযুক্ত হয়েছে:', socket.id);

  socket.on('register-gateway', () => {
    socket.join('gateway-room');
    console.log('SIM Gateway Device Online!');
  });

  socket.on('make-sim-call', (data) => {
    console.log(`Call request for: ${data.phoneNumber}`);
    io.to('gateway-room').emit('execute-call', { phoneNumber: data.phoneNumber });
  });

  socket.on('disconnect', () => {
    console.log('ডিভাইস ডিসকানেক্ট হয়েছে:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
