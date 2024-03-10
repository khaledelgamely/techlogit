import mongoose, { Types, Schema } from "mongoose";

const projectsSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "title is required"],
      unique: [true, "title should be unique"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "fullDescription is required"],
      minLength: [5, "too short  fullDescription"],
    },
    projectCategory: {
      type: Types.ObjectId,
      ref: "ProjectsCategories",
    },
    smallImage: {
      type: String,
      required: [true, "smallImage is required"],
    },
    largeImage: {
      type: String,
      required: [true, "largeImage is required"],
    },
  },
  { timestamps: true }
);

export const Projects =
  mongoose.models.Projects || mongoose.model("Projects", projectsSchema);
