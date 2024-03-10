import { ProjectsCategories } from "./projectsCategories.model.js";
import { ErrorMessage } from "../../utils/ErrorMessage.js";
import { catchError } from "../../utils/catchAsyncError.js";
// import { ServicesModel } from "../services/services.model.js";

export const getAllCategories = catchError(async (request, response, next) => {
  const categories = await ProjectsCategories.find();
  if (categories.length == 0) {
    throw ErrorMessage(404, "no categories found");
  }
  response.status(200).json(categories);
});

export const addCategory = catchError(async (request, response, next) => {
  const newCategory = await new ProjectsCategories(request.body).save();
  if (!newCategory) {
    throw ErrorMessage(404, "No categories Added Check Your Data 🙄");
  }
  response.status(201).json(newCategory);
});

export const updateCategory = catchError(async (request, response, next) => {
  const updatedCategory = await ProjectsCategories.updateOne(
    { _id: request.params.id },
    request.body
  );
  if (updatedCategory.matchedCount == 0) {
    throw ErrorMessage(404, "category id doesn't exist 🙄");
  }
  response.status(201).json({ message: "category is updated successfully..!" });
});

export const deleteCategory = catchError(async (request, response, next) => {
  const deletedCategory = await ProjectsCategories.deleteOne({
    _id: request.params.id,
  });
  if (deletedCategory.deletedCount == 0) {
    throw ErrorMessage(404, "category id doesn't exist 🙄");
  }
  // const deletedServices = await ServicesModel.deleteMany({
  //   category: request.params.id,
  // });
  // if (deletedServices.deletedCount == 0) {
  //   throw ErrorMessage(404, "this category doesnt have any services");
  // }
  response.status(201).json({ message: "category is deleted successfully..!" });
});
