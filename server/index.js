import express from 'express';
import morgan from 'morgan';
//importar socket
import {Server} from 'socket.io';
import {createServer} from 'node:http';

//importar db
import {connectDB} from '../config/database.js';

//conectar a la base de datos
connectDB();

// Obtener modelos
import User from '../models/user.js';
import Conversation from '../models/conversation.js';

const port = process.env.PORT || 3000;
const app = express();
const server  = createServer(app);
const io = new Server(server,{
    connectionStateRecovery: {
        connectionStateRecovery:{}
    },
});

// Listen for incoming connections
io.on('connection', (socket) => {
    console.log('A user connected');
    //busco las conversaciones previas del usuario
    const conversacionesPrevias =  async (id) => {
        const conversaciones = await Conversation.find({users: id});
        return conversaciones;
    }
    
    // Listen for a chat message
    socket.on('chat', (msg) => {
        console.log('message: ' + msg);
        console.log('user: ' + socket.id);
        console.log('conversaciones: ' + conversacionesPrevias(socket.id));
        // Broadcast the message to all connected clients
        io.emit('chat', msg);
        io.emit('conversacionesPrevias',conversacionesPrevias(socket.id));
    });
    // Listen for a disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Log all requests to the console with morgan
app.use(morgan('dev'));
// Serve static files from the 'public' folder
app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/client/index.html');
});
// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

