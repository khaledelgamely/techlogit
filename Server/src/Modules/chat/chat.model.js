import mongoose, { Types, Schema } from "mongoose";

const chatSchema = new Schema({
  members: { type: [Types.ObjectId], ref: "User" },
} ,{ timestamps: true });

export const ChatModel =
  mongoose.models.Chats || mongoose.model("Chats", chatSchema);
