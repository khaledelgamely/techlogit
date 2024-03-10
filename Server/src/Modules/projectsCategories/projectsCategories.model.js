import mongoose, { Types, Schema } from "mongoose";

const projectsCategoriesSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "title is required"],
      unique: [true, "title should be unique"],
    },
  },
  { timestamps: true }
);

export const ProjectsCategories =
  mongoose.models.ProjectsCategories ||
  mongoose.model("ProjectsCategories", projectsCategoriesSchema);
