//IO and socket logics
//importar socket
import { Server } from "socket.io";

// Obtener modelos
import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import Room from "../models/room.js";

const ioLogic = (server) => {
  const io = new Server(server, {
    connectionStateRecovery: {
      connectionStateRecovery: {},
    },
  });

  // Listen for incoming connections
  io.on("connection", (socket) => {
    console.log("A user connected");
    //busco las conversaciones previas del usuario
    const conversacionesPrevias = async (id) => {
      const conversaciones = await Conversation.find({ users: id });
      return conversaciones;
    };

    //find a room
    const room = async (roomID) => {
      let room = await Room.findOne({ number: roomID });
      return room;
    };
    //find users in room
    const usersInConversation = async (roomID) => {
      let myRoom = await room(roomID);
      let conversation = await Conversation.findById(myRoom.conversation);
      let users = conversation.participants;
      return users;
    };
    // // Listen for a join room
    // socket.on("joinRoom", (roomID) => {
    //   console.log("roomID: ", roomID);
    //   socket.join(roomID);
    // });

    //save message
    const newMessage = async (data) => {
      console.log("La data Importante: ", data);
      console.log("la room es", data.room);
      //save message
      const message = new Message({
        sender: data.datosMsg.sender,
        content: data.datosMsg.msg,
      });
      await message.save();
      //save message in conversation
      let conversation = await Conversation.findById(data.room.conversation);
      console.log("conversation importanteee: ", conversation);
      conversation.messages.push(message._id);
      await conversation.save();
    };

    // Listen for a chat message
    socket.on("chat", async (msg) => {
      console.log("message: ", msg);
      let myRoom = await room(msg.roomID);
      console.log("room: ", myRoom);
      let users = await usersInConversation(msg.roomID);
      console.log("users: ", users);
      //save message
      let data = { datosMsg: msg, room: myRoom };
      await newMessage(data);

      // Broadcast the message to all connected clients
      io.emit("chat", msg);
      // io.emit("conversacionesPrevias", conversacionesPrevias(socket.id));
    });
    // Listen for a disconnect
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};

export default ioLogic;
