import { HomeModel } from "./home.model.js";
import { ErrorMessage } from "../../utils/ErrorMessage.js";
import { catchError } from "../../utils/catchAsyncError.js";
import { ServicesModel } from "../services/services.model.js";
import { Projects } from "../projects/projects.model.js";
import { CategoriesModel } from "../categories/categories.model.js";

export const getHome = catchError(async (request, response, next) => {
  const homeDetails = await HomeModel.findOne()
    .populate({
      path: "ourServices",
    })
    .populate({
      path: "latestProjects",
      populate: {
        path: "projectCategory",
      },
    });
  if (!homeDetails) {
    throw ErrorMessage(404, "no categories found");
  }
  response.status(200).json(homeDetails);
});

export const updateHome = catchError(async (request, response, next) => {
  const updatedHome = await HomeModel.updateOne({}, request.body);
  if (updatedHome.matchedCount == 0) {
    throw ErrorMessage(404, "category id doesn't exist 🙄");
  }
  response.status(201).json({ message: "home is updated successfully..!" });
});

export const addService = catchError(async (request, response, next) => {
  const category = await CategoriesModel.findOne({
    _id: request.params.serviceId,
  });
  if (!category) {
    throw ErrorMessage(404, "No such category id exists");
  }
  const updatedServices = await HomeModel.updateOne(
    {},
    {
      $addToSet: { ourServices: request.params.serviceId },
    }
  );
  if (updatedServices.matchedCount == 0) {
    throw ErrorMessage(404, "error finding home document");
  }
  response
    .status(201)
    .json({ message: "category is posted to our services successfully..!" });
});

export const deleteService = catchError(async (request, response, next) => {
  const updatedServices = await HomeModel.updateOne(
    {},
    { $pull: { ourServices: request.params.serviceId } }
  );
  if (updatedServices.matchedCount == 0) {
    throw ErrorMessage(404, "service id doesn't exist 🙄");
  }
  response
    .status(201)
    .json({ message: "service is deleted from our services successfully..!" });
});

export const addProject = catchError(async (request, response, next) => {
  const project = await Projects.findOne({
    _id: request.params.projectId,
  });
  if (!project) {
    throw ErrorMessage(404, "No such project id exists");
  }
  const updatedProjects = await HomeModel.updateOne(
    {},
    {
      $addToSet: { latestProjects: request.params.projectId },
    }
  );
  if (updatedProjects.matchedCount == 0) {
    throw ErrorMessage(404, "error finding home document");
  }
  response
    .status(201)
    .json({ message: "project is posted to latest projects successfully..!" });
});

export const deleteProject = catchError(async (request, response, next) => {
  const updatedProjects = await HomeModel.updateOne(
    {},
    { $pull: { latestProjects: request.params.projectId } }
  );
  if (updatedProjects.matchedCount == 0) {
    throw ErrorMessage(404, "service id doesn't exist 🙄");
  }
  response.status(201).json({
    message: "project is deleted from latest projects successfully..!",
  });
});
export const addClient = catchError(async (request, response, next) => {
  for (const file in request.files) {
    let [image] = request.files[file];
    request.body[file] = image.dest;
  }
  const updatedClients = await HomeModel.updateOne(
    {},
    {
      $addToSet: { clients: request.body.clientImage },
    }
  );
  if (updatedClients.matchedCount == 0) {
    throw ErrorMessage(404, "error finding home document");
  }
  const newlyAddedClient = request.body.clientImage;

  response.status(201).json({
    message: "client is posted to our clients successfully..!",
    data: newlyAddedClient,
  });
});

export const deleteClient = catchError(async (request, response, next) => {
  const updatedClients = await HomeModel.updateOne(
    {},
    { $pull: { clients: request.body.imageName } }
  );
  if (updatedClients.matchedCount == 0) {
    throw ErrorMessage(404, "service id doesn't exist 🙄");
  }
  response.status(201).json({
    message: "client is deleted from our clients successfully..!",
  });
});

export const updateHeader = catchError(async (request, response, next) => {
  if (request.files) {
    for (const key in request.files) {
      let [image] = request.files[key];
      request.body[key] = image.dest;
    }
  }
  if (request.body) {
    const updatedData = {
      $set: {
        "getStarted.title": request.body.title,
        "getStarted.description": request.body.description,
        "getStarted.image": request.body.image,
        "getStarted.videoUrl": request.body.videoUrl,
      },
    };
    const data = await HomeModel.findByIdAndUpdate(
      { _id: "650dde1cc3475a4faa798240" },
      updatedData,
      { new: true }
    ).select("getStarted");
    if (data.nModified === 0) {
      return response.status(404).json({ message: "Home not found" });
    }
    response
      .status(201)
      .json({ message: "Header data updated successfully", data });
  } else {
    return response
      .status(400)
      .json({ error: "Invalid FormData or missing fields" });
  }
});

export const updateAboutUs = catchError(async (request, response, next) => {
  if (request.files) {
    for (const key in request.files) {
      let [image] = request.files[key];
      request.body[key] = image.dest;
    }
  }
  if (request.body) {
    const updatedData = {
      $set: {
        "aboutUs.title": request.body.title,
        "aboutUs.description": request.body.description,
        "aboutUs.image": request.body.image,
      },
    };
    const data = await HomeModel.findByIdAndUpdate(
      { _id: "650dde1cc3475a4faa798240" },
      updatedData,
      { new: true }
    ).select("aboutUs");
    if (data.nModified === 0) {
      return response.status(404).json({ message: "Home not found" });
    }
    response
      .status(201)
      .json({ message: "AboutUs data updated successfully", data });
  } else {
    return response
      .status(400)
      .json({ error: "Invalid FormData or missing fields" });
  }
});

export const updateContact = catchError(async (request, response, next) => {
  if (request.body) {
    const updatedData = {
      $set: {
        "contact.bigTitle": request.body.bigTitle,
        "contact.smallTitle": request.body.smallTitle,
        "contact.description": request.body.description,
        "contact.phone": request.body.phone,
        "contact.mail": request.body.mail,
        "contact.location": request.body.location,
        "contact.facebook": request.body.facebook,
        "contact.insta": request.body.insta,
        "contact.discord": request.body.discord,
        "contact.linkedin": request.body.linkedin,
      },
    };
    const data = await HomeModel.findByIdAndUpdate(
      { _id: "650dde1cc3475a4faa798240" },
      updatedData,
      { new: true }
    ).select("contact");
    if (data.nModified === 0) {
      return response.status(404).json({ message: "Home not found" });
    }
    response
      .status(201)
      .json({ message: "Contact data updated successfully", data });
  } else {
    return response
      .status(400)
      .json({ error: "Invalid FormData or missing fields" });
  }
});

export const updateWhyChooseUs = catchError(async (request, response, next) => {
  if (!request.body) {
    return response
      .status(400)
      .json({ error: "Invalid FormData or missing fields" });
  }
  const home = await HomeModel.findById("650dde1cc3475a4faa798240");

  if (!home) {
    return response.status(404).json({ message: "Home not found" });
  }
  const updateData = { ...home._doc };

  if (request.files[`whyChooseUsImage`]) {
    updateData.whyChooseUs.image = request.files[`whyChooseUsImage`][0].dest;
  }
  if (request.body["whyChooseUsTitle"]) {
    updateData.whyChooseUs.title = request.body["whyChooseUsTitle"];
  }

  const reasonNames = ["first", "second", "third", "fourth"];

  for (const reason of reasonNames) {
    if (request.body[`${reason}Title`]) {
      updateData.whyChooseUs.reasons[reason].title =
        request.body[`${reason}Title`];
    }

    if (request.body[`${reason}Description`]) {
      updateData.whyChooseUs.reasons[reason].description =
        request.body[`${reason}Description`];
    }

    if (request.files && request.files[`${reason}Image`]) {
      updateData.whyChooseUs.reasons[reason].image =
        request.files[`${reason}Image`][0].dest;
    }
  }
  await HomeModel.findByIdAndUpdate("650dde1cc3475a4faa798240", updateData, {
    new: true,
  }).select("whyChooseUs");
  response.status(201).json({
    message: "whyChooseUs data updated successfully",
    whyChooseUs: updateData.whyChooseUs,
  });
});
