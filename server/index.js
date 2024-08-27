import express from "express";
import morgan from "morgan";
//importar socket
import { Server } from "socket.io";
import { createServer } from "node:http";
//importar logica de io
import ioLogic from "./ioLogic.js";
//importar db
import { connectDB } from "../config/database.js";
//importar cors
import cors from "cors";
//conectar a la base de datos
connectDB();

// Obtener modelos
import User from "../models/user.js";
import Conversation from "../models/conversation.js";
import Room from "../models/room.js";

const port = process.env.PORT || 3000;
const app = express();
const server = createServer(app);
ioLogic(server);

////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                          CONFIGURACIONES                                       */
////////////////////////////////////////////////////////////////////////////////////////////////////

//configuración de cors
app.use(cors());

// Configuración de Bootstrap
app.use(
  "/bootstrap",
  express.static(process.cwd() + "/node_modules/bootstrap/dist")
);

// Configuración de jQuery
app.use("/jquery", express.static(process.cwd() + "/node_modules/jquery/dist"));

// Configuración de Popper.js
app.use(
  "/popper",
  express.static(process.cwd() + "/node_modules/@popperjs/core/dist/umd")
);

// Configuración de Socket.io
app.use(
  "/socket.io",
  express.static(process.cwd() + "/node_modules/socket.io/client-dist")
);

// Configuración de Bootstrap Icons
app.use(
  "/bootstrap-icons",
  express.static(process.cwd() + "/node_modules/bootstrap-icons/font")
);

// Middleware para manejar datos urlencoded (formularios)
app.use(express.urlencoded({ extended: true }));

// Middleware para manejar datos JSON (si necesitas)
app.use(express.json());

// Log all requests to the console with morgan
app.use(morgan("dev"));

////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                          ROUTES                                                */
////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                          GETTER                                                */
////////////////////////////////////////////////////////////////////////////////////////////////////

// Serve static files from the 'public' folder
app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/client/createRoom.html");
});

//redirect to room
app.get("/room/:room", (req, res) => {
  res.sendFile(process.cwd() + "/client/room.html");
});

//get data for room
app.get("/getRoom/:room", async (req, res) => {
  //ask for the room
  let room = await Room.findOne({ number: req.params.room });
  if (room) {
    console.log("room", room);
    console.log("usuario dueño", room.owner);
    let roomData = {
      room: room.number,
      messages: room.messages,
      owner: room.owner,
      sender: room.owner,
    };
    //get the conversation
    let conversation = await Conversation.findById(room.conversation);
    //find id and the usernames of the participants
    let participants = [];
    for (let i = 0; i < conversation.participants.length; i++) {
      let user = await User.findById(conversation.participants[i]);
      participants.push(user.username);
    }
    roomData.participants = participants;
    res.json(roomData); // Enviar los datos como JSON
  } else {
    res.status(404).send("Room not found");
  }
});

//get data test
app.get("/api/data", (req, res) => {
  let number = Math.floor(Math.random() * 9000 + 1000);
  res.json({ message: "FUNCIONO IUPII 😭😭: conectado a Node.js!", number: number });
});

////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                          POST                                                  */
////////////////////////////////////////////////////////////////////////////////////////////////////

//generate room and redirect to it
app.post("/createRoom", async (req, res) => {
  //generate room
  const room = new Room();
  //random number between 1000 to 9999
  let number = Math.floor(Math.random() * 9000 + 1000);
  //check if the number is already in use
  while (await Room.findOne({ number: number })) {
    number = Math.floor(Math.random() * 9000 + 1000);
  }
  room.number = number;
  //get username and find it, if they aren't exist create user
  let username = req.body.username;
  console.log("query", req.body);
  let user = await User.findOne({ username: username });
  //if user doesn't exist create it
  if (!user || user === null) {
    user = new User({ username: username });
    await user.save();
  }
  //save the owner of the room
  room.owner = user._id;
  //new conversation for the room
  let conversation = new Conversation();
  conversation.participants.push(user._id);
  await conversation.save();
  room.conversation = conversation._id;
  await room.save();

  res.redirect("/room/" + room.number);
});

////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                          START ENGINE                                          */
////////////////////////////////////////////////////////////////////////////////////////////////////

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
