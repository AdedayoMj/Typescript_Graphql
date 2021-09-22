import { Document } from "mongoose";

export default interface IAuthor extends Document {
  name: string;
  age: number;
}
