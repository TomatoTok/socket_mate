import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true }, // El contenido del mensaje
  timestamp: { type: Date, default: Date.now },
  seen: { type: Boolean, default: false }, // Si el receptor ha visto el mensaje
});

const Message = mongoose.model('Message', messageSchema);
export default Message;