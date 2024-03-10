import { Projects } from "./projects.model.js";
import { ProjectsCategories } from "../projectsCategories/projectsCategories.model.js";
import { ErrorMessage } from "../../utils/ErrorMessage.js";
import { catchError } from "../../utils/catchAsyncError.js";
// import { ServicesModel } from "../services/services.model.js";

export const getAllProjects = catchError(async (request, response, next) => {
  const projects = await Projects.find().populate({
    path: "projectCategory",
  });
  if (projects.length == 0) {
    throw ErrorMessage(404, "no Projects found");
  }
  response.status(200).json(projects);
});

export const getSingleProject = catchError(async (request, response, next) => {
  const project = await Projects.findOne({ _id: request.params.projectId });
  if (!project) {
    throw ErrorMessage(404, "no Projects found");
  }
  response.status(200).json(project);
});

export const getcategoryProjects = catchError(
  async (request, response, next) => {
    const category = await ProjectsCategories.findOne({
      _id: request.params.categoryId,
    });
    if (!category) {
      throw ErrorMessage(404, "No such category id exists");
    }
    const projects = await Projects.find({
      projectCategory: request.params.categoryId,
    });
    if (projects.length == 0) {
      throw ErrorMessage(404, "no projects found for this category");
    }
    response.status(200).json(projects);
  }
);

export const addProject = catchError(async (request, response, next) => {
  const projectCategory = await ProjectsCategories.findOne({
    _id: request.body.projectCategory,
  });
  if (!projectCategory) {
    throw ErrorMessage(404, "No such project category id exists");
  }
  for (const file in request.files) {
    let [image] = request.files[file];
    request.body[file] = image.dest;
  }
  const newProject = await new Projects(request.body).save();
  if (!newProject) {
    throw ErrorMessage(404, "No Projects Added Check Your Data 🙄");
  }
  response.status(201).json(newProject);
});

export const updateProject = catchError(async (request, response, next) => {
  if (request.files) {
    for (const file in request.files) {
      let [image] = request.files[file];
      request.body[file] = image.dest;
    }
  }
  if (request.body.projectCategory) {
    const projectCategory = await ProjectsCategories.findOne({
      _id: request.body.projectCategory,
    });
    if (!projectCategory) {
      throw ErrorMessage(404, "No such project category id exists");
    }
  }
  const updatedProject = await Projects.findByIdAndUpdate(
    { _id: request.params.projectId },
    request.body,
    { new: true }
  );
  if (!updatedProject) {
    throw ErrorMessage(404, "Project id doesn't exist ");
  }
  response
    .status(201)
    .json({ message: "project update successfully", updatedProject });
});

export const deleteProject = catchError(async (request, response, next) => {
  const deletedProject = await Projects.deleteOne({
    _id: request.params.projectId,
  });
  if (deletedProject.deletedCount == 0) {
    throw ErrorMessage(404, "category id doesn't exist ");
  }

  response.status(201).json({ message: "Project is deleted successfully..!" });
});
