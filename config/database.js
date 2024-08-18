//importar mongoose
import mongoose from "mongoose";
import {MONGODB_URI_LOCAL as db_url} from "../config/config.js";
export const connectDB = async () => {
  console.log("Connecting to DB");
  await mongoose
    .connect(db_url)
    .then(() => {
      console.log("Conectado a MongoDB");
    })
    .catch((err) => {
      console.error("Error conectando a MongoDB", err);
    });
};
