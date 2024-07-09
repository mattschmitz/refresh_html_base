const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Watch for changes in the 'public' directory
fs.watch(path.join(__dirname, 'public'), (eventType, filename) => {
  if (filename) {
    console.log(`${filename} file Changed`);
    io.emit('refresh');
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
