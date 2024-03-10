import { Reviews } from "./reviews.model.js";
import { ErrorMessage } from "../../utils/ErrorMessage.js";
import { catchError } from "../../utils/catchAsyncError.js";
// import { ServicesModel } from "../services/services.model.js";

export const getAllReviews = catchError(async (request, response, next) => {
  const reviews = await Reviews.find();
  if (reviews.length == 0) {
    throw ErrorMessage(404, "no reviews found");
  }
  response.status(200).json(reviews);
});

export const addReview = catchError(async (request, response, next) => {
  for (const file in request.files) {
    let [image] = request.files[file];
    request.body[file] = image.dest;
  }
  const newReview = await new Reviews(request.body).save();
  if (!newReview) {
    throw ErrorMessage(404, "No reviews Added Check Your Data 🙄");
  }
  response.status(201).json(newReview);
});

export const updateReview = catchError(async (request, response, next) => {
  if (request.files) {
    for (const file in request.files) {
      let [image] = request.files[file];
      request.body[file] = image.dest;
    }
  }
  const updatedReview = await Reviews.findByIdAndUpdate(
    { _id: request.params.reviewId },
    request.body,{ new: true }
  );
  if (updatedReview.matchedCount == 0) {
    throw ErrorMessage(404, "review id doesn't exist 🙄");
  }
  response.status(201).json(updatedReview);
});

export const deleteReview = catchError(async (request, response, next) => {
  const deletedReview = await Reviews.deleteOne({
    _id: request.params.reviewId,
  });
  if (deletedReview.deletedCount == 0) {
    throw ErrorMessage(404, "review id doesn't exist 🙄");
  }

  response.status(201).json({ message: "review is deleted successfully..!" });
});
