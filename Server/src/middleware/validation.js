import joi from "joi";
import { Types } from "mongoose";
const dataMethods = ["body", "params", "query", "headers", "file"];

const validateObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helper.message("In-valid objectId");
};

export const generalFields = {
  email: joi.string(),
  // .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
  password: joi
    .string()
    .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/))
    .required(),
  cPassword: joi.string().required(),
  id: joi.string().custom(validateObjectId),
  file: joi.object({
    size: joi.number().positive().required(),
    path: joi.string().required(),
    filename: joi.string().required(),
    destination: joi.string().required(),
    mimetype: joi.string().required(),
    encoding: joi.string().required(),
    originalname: joi.string().required(),
    fieldname: joi.string().required(),
    dest: joi.string().required(),
  }),
};

export const validation = (schema) => {
  return (request, response, next) => {
    // console.log("files", request.body);
    // console.log(request.params);
    let inputs = {
      ...request.body,
      ...request.params,
      ...request.query,
    };
    if (request.file) {
      inputs.file = request.file;
    } else if (request.files) {
      for (const file in request.files) {
        [inputs[file]] = request.files[file];
      }
    }
    console.log("inputs", inputs);
    const { error } = schema.validate(inputs, { abortEarly: false });
    try {
      if (error) {
        let errors = error.details.map((detail) => detail.message);

        throw new Error(errors, { cause: 400 });
      }

      return next();
    } catch (err) {
      next(err);
    }
  };
};

// export const validation = (schema) => {
//     return (req, res, next) => {
//         console.log({body:req.body});
//         const validationErr = []
//         dataMethods.forEach(key => {
//             if (schema[key]) {
//                 const validationResult = schema[key].validate(req[key], { abortEarly: false })
//                 if (validationResult.error) {
//                     validationErr.push(validationResult.error.details)
//                 }
//             }
//         });

//         if (validationErr.length) {
//             return res.json({ message: "Validation Err", validationErr })
//         }
//         return next()
//     }
// }
