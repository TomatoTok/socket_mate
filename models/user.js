import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String },
  password: { type: String, required: true },
  // profilePicture: { type: String }, // URL de la imagen de perfil
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Lista de amigos/contacts
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
export default User;