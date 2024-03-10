import mongoose, { Types, Schema } from "mongoose";

const schema = new Schema(
  {
    msgType: {
      type: String,
      enum: ["audio", "text", "image", "file"],
    },
    content: String,
    sender: {
      // id
      type: Types.ObjectId,
      ref: "User",
    },
    conversation: {
      // id
      type: Types.ObjectId,
      ref: "Conversations",
      required: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    image: String,
    isFromAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
export const Messages =
  mongoose.models.Messages || mongoose.model("Messages", schema);
