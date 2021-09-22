import mongoose, { Schema } from "mongoose";
import IBook from "../interface/book";

const BookSchema: Schema = new Schema({
  authorId: { type: String, unique: true },
  name: { type: String },
  genre: { type: String },
});

export default mongoose.model<IBook>("Book", BookSchema);
