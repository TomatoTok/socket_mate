
import express from 'express'
import http from 'http'
// import socketIo from 'socket.io'
import { Server as socketIo } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new socketIo(server, {
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
server.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT} base_url ${process.cwd()}`));
