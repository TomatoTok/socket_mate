// const http = require('http');

// const hostname = '127.0.0.1';
// const port = 3000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hola, Mundo!\n');
// });

// server.listen(port, hostname, () => {
//   console.log(`El servidor se está ejecutando en http://${hostname}:${port}/`);
// });

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",  // Permite todas las conexiones, ajusta según tus necesidades
  }
});

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // Ejemplo de evento de mensaje
  socket.on('mensaje', (data) => {
    console.log('Mensaje recibido:', data);
    io.emit('respuesta', { mensaje: 'Hola desde el servidor' });
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
