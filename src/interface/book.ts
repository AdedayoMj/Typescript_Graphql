import { Document } from "mongoose";

export default interface IBook extends Document {
  authorId: string;
  name: string;
  genre: string;
}
