import { ErrorMessage } from "../../utils/ErrorMessage.js";
import { catchError } from "../../utils/catchAsyncError.js";
import { UserModel } from "../user/user.model.js";
import { deleteOne, deleteMany } from "../../utils/factory.js";
import { ApiFeature } from "../../utils/ApiFeature.js";

const createUser = catchError(async (request, response, next) => {
  let user = await UserModel.findOne({ email: request.body.email });
  if (user) return next(ErrorMessage(409, "Account Already Exist 🙄"));
  request.body.confirmEmail = true;
  if (request.file) {
    request.body.profilePic = request.file.dest;
  }
  let result = new UserModel(request.body);
  result = await result.save();
  if (result) {
    return response.status(201).json({
      message: "Add New User Successfully 😃",
      result,
    });
  } else {
    throw new ErrorMessage(400, "user doesn't created check data you provide");
  }
});

const getAllUser = catchError(async (request, response, next) => {
  let apiFeature = new ApiFeature(UserModel.find(), request.query)

    .fields()
    .search()
    .filter()
    .sort();
  // .paginate();
  // console.log(apiFeature);
  //? execute query
  let result = await apiFeature.mongooseQuery;

  let cloned = apiFeature.mongooseQuery.clone();
  // const results = await cloned;
  // let results = await apiFeature.totalCount;
  // console.log(results);
  response.status(200).json({
    message: "Done 😃",

    result,
    totalCount: apiFeature.totalCount,
  });
});
const getUser = catchError(async (request, response, next) => {
  let { id } = request.params;
  let result = await UserModel.findById(id).populate("orders");
  if (!result) {
    return next(ErrorMessage(404, `User Not Found 😥`));
  }
  response.status(200).json({
    message: "Done 😃",
    result,
  });
});

const updateUser = catchError(async (request, response, next) => {
  let { id } = request.params;
  const { password } = request.body;
  if (password) {
    request.body.changePasswordAt = Date.now();
  }
  if (request.file) {
    request.body.profilePic = request.file.dest;
  }
  let result = await UserModel.findByIdAndUpdate(id, request.body, {
    new: true,
  });
  if (!result) {
    return next(ErrorMessage(404, `User Not Found 😥`));
  }
  response.status(200).json({
    message: "Done 😃",
    result,
  });
});
const updateContactInfo = catchError(async (request, response, next) => {
  const { id } = request.params;

  try {
    const updatedFields = request.body;
    if (!updatedFields) {
      return next(ErrorMessage(400, "ContactInformation fields are required"));
    }
    const result = await UserModel.findByIdAndUpdate(
      id,
      {
        $set: { ContactInformation: { ...updatedFields } },
      },
      { new: true }
    );
    if (!result) {
      return next(ErrorMessage(404, `User Not Found 😥`));
    }
    response.status(200).json({
      message: "Contact Information Updated 😃",
      result,
    });
  } catch (error) {
    return next(ErrorMessage(500, "Internal Server Error"));
  }
});

const suspendUsers = catchError(async (request, response, next) => {
  let { ids, suspend } = request.body;
  const suspendedUsers = [];

  for (const id of ids) {
    let result = await UserModel.findByIdAndUpdate(
      id,
      { suspend },
      {
        new: true,
      }
    );
    if (result) {
      suspendedUsers.push(result);
    }
  }

  if (suspendedUsers.length == 0) {
    return next(ErrorMessage(404, `Users Not Found 😥`));
  }
  response.status(200).json({
    message: "Done 😃",
    suspendedUsers,
  });
});
const changeUserPassword = catchError(async (request, response, next) => {
  let { id } = request.params;
  request.body.changePasswordAt = Date.now();
  let result = await UserModel.findByIdAndUpdate(id, request.body, {
    new: true,
  });
  if (!result) {
    return next(ErrorMessage(404, `User Not Found 😥`));
  }
  response.status(200).json({
    message: "Done  password changed successfully😃",
    result,
  });
});
const deleteUser = deleteOne(UserModel);
const deleteUsers = deleteMany(UserModel);

export {
  createUser,
  getAllUser,
  getUser,
  updateUser,
  suspendUsers,
  deleteUser,
  deleteUsers,
  changeUserPassword,
  updateContactInfo,
};
