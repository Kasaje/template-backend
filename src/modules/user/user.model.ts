import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  id: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    password: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

export const UserModel = mongoose.model<IUser>("User", userSchema);
