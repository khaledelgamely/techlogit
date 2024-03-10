import mongoose, { Types, Schema } from "mongoose";

const schema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
export const OnlineUsers =
  mongoose.models.OnlineUsers || mongoose.model("OnlineUsers", schema);
