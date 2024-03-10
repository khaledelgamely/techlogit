import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addNewMessage = joi
  .object({
    userId: generalFields.id.required(),
    msgType: joi.string().valid("audio", "text", "image", "file").required(),
    content: joi.string(),
    conversation: generalFields.id.required(),
    sender: generalFields.id.required(),
    image: generalFields.file,
  })
  .required();

export const adminAddNewMessage = joi
  .object({
    msgType: joi.string().valid("audio", "text", "image", "file").required(),
    content: joi.string(),
    conversation: generalFields.id.required(),
    sender: generalFields.id.required(),
    image: generalFields.file,
  })
  .required();

export const getConvoMessages = joi
  .object({
    userId: generalFields.id.required(),
    convId: generalFields.id.required(),
  })
  .required();
export const getAdminConvoMessages = joi
  .object({
    convId: generalFields.id.required(),
  })
  .required();
export const getFiles = joi
  .object({
    userId: generalFields.id.required(),
    convId: generalFields.id.required(),
  })
  .required();

export const getAdminFiles = joi
  .object({
    convId: generalFields.id.required(),
  })
  .required();
