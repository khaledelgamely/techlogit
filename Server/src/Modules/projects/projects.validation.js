import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addProject = joi
  .object({
    title: joi.string().min(2).required(),
    description: joi.string().min(5).max(400).required(),
    projectCategory: generalFields.id.required(),
    smallImage: generalFields.file.required(),
    largeImage: generalFields.file.required(),
  })
  .required();
export const getSingleProject = joi
  .object({
    projectId: generalFields.id.required(),
  })
  .required();

export const updateProject = joi
  .object({
    projectId: generalFields.id.required(),
    title: joi.string().min(2),
    description: joi.string().min(5).max(400),
    projectCategory: generalFields.id,
    smallImage: generalFields.file,
    largeImage: generalFields.file,
  })
  .required();
export const getcategoryProjects = joi
  .object({
    categoryId: generalFields.id.required(),
  })
  .required();

export const deleteProject = joi
  .object({
    projectId: generalFields.id.required(),
  })
  .required();
