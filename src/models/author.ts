import mongoose, { Schema } from "mongoose";
import IAuthor from "../interface/author";

const AuthorSchema: Schema = new Schema({
  name: { type: String },
  age: { type: Number },
});

export default mongoose.model<IAuthor>("Author", AuthorSchema);
