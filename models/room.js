import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  number: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  conversation : { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }], // Lista de mensajes
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" }, // Último mensaje enviado
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

const Room = mongoose.model("Room", roomSchema);
export default Room;
