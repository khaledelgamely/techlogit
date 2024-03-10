import { ErrorMessage } from "./ErrorMessage.js";
import { catchError } from "./catchAsyncError.js";

const deleteOne = (model) => {
  return catchError(async (request, response, next) => {
    let { id } = request.params;
    let result = await model.findByIdAndDelete(id);
    if (!result) {
      return next(ErrorMessage(404, `Document Not Found 😥`));
    }
    response.status(200).json({
      message: "Delete Successfully 🤝",
    });
  });
};

const deleteMany = (model) => {
  return catchError(async (request, response, next) => {
    let { ids } = request.body;
    const deleted = [];
    for (const id of ids) {
      let result = await model.findByIdAndDelete(id);
      if (result) {
        deleted.push(result);
      }
    }
    if (deleted.length == 0) {
      throw ErrorMessage(404, "no users found for deleting");
    }
    response.status(200).json({ deleted, message: "Delete Successfully 🤝" });
  });
};

export { deleteOne, deleteMany };
