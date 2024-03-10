import { ServicesModel } from "./services.model.js";
import { CategoriesModel } from "../categories/categories.model.js";
import { ErrorMessage } from "../../utils/ErrorMessage.js";
import { catchError } from "../../utils/catchAsyncError.js";
import { Projects } from "../projects/projects.model.js";
export const getAllServices = catchError(async (request, response, next) => {
  const services = await ServicesModel.find({}).populate("category");
  if (services.length == 0) {
    throw ErrorMessage(404, "no services found ");
  }
  response.status(200).json(services);
});

export const getCategoryServices = catchError(
  async (request, response, next) => {
    const category = await CategoriesModel.findOne({
      _id: request.params.categoryId,
    });
    if (!category) {
      throw ErrorMessage(404, "No such category id exists");
    }
    const services = await ServicesModel.find({
      category: request.params.categoryId,
    });
    if (services.length == 0) {
      throw ErrorMessage(404, "no services found for this category");
    }
    response.status(200).json(services);
  }
);

export const getSingleService = catchError(async (request, response, next) => {
  const service = await ServicesModel.findOne({
    _id: request.params.serviceId,
  }).populate({
    path: "oldWork",
    populate: {
      path: "projectCategory",
    },
  });
  if (!service) {
    throw ErrorMessage(404, "no services found for this category");
  }
  response.status(200).json(service);
});
export const addCategoryService = catchError(
  async (request, response, next) => {
    for (const file in request.files) {
      let [image] = request.files[file];
      request.body[file] = image.dest;
    }
    const category = await CategoriesModel.findOne({
      _id: request.body.category,
    });
    if (!category) {
      throw ErrorMessage(404, "No such category id exists");
    }
    const newService = await new ServicesModel(request.body).save();
    if (!newService) {
      throw ErrorMessage(404, "No categories Added Check Your Data 🙄");
    }
    response.status(201).json(newService);
  }
);

export const editCategoryService = catchError(
  async (request, response, next) => {
    if (request.files) {
      for (const file in request.files) {
        let [image] = request.files[file];
        request.body[file] = image.dest;
      }
    }
    if (request.body.category) {
      const category = await CategoriesModel.findOne({
        _id: request.body.category,
      });
      if (!category) {
        throw ErrorMessage(404, "No such category id exists");
      }
    }
    const updatedService = await ServicesModel.updateOne(
      { _id: request.params.serviceId },
      request.body
    );
    if (updatedService.matchedCount == 0) {
      throw ErrorMessage(404, "service id doesn't exist 🙄");
    }
    response
      .status(201)
      .json({ message: "service is updated successfully..!" });
  }
);
export const deleteCategoryService = catchError(
  async (request, response, next) => {
    const deletedService = await ServicesModel.deleteOne({
      _id: request.params.serviceId,
    });
    if (deletedService.deletedCount == 0) {
      throw ErrorMessage(404, "service id doesn't exist 🙄");
    }
    response
      .status(201)
      .json({ message: "service is deleted successfully..!" });
  }
);

export const discountForAllServices = catchError(
  async (request, response, next) => {
    const services = await ServicesModel.updateMany(
      {},
      {
        $inc: { discount: request.body.discount },
      }
    );
    if (services.length == 0) {
      throw ErrorMessage(404, "no services found ");
    }
    response
      .status(200)
      .json({ message: "discount For All Services is done..!" });
  }
);
export const discountForSingleCategory = catchError(
  async (request, response, next) => {
    const services = await ServicesModel.updateMany(
      { category: request.params.categoryId },
      {
        $inc: { discount: request.body.discount },
      }
    );
    if (services.length == 0) {
      throw ErrorMessage(404, "no services found ");
    }
    response
      .status(200)
      .json({ message: "discount For Single Category is done..!" });
  }
);

export const addVariationToService = catchError(
  async (request, response, next) => {
    if (request.file) {
      request.body.largeImage = request.file.dest;
    }
    const dropDownNames = await ServicesModel.findOne(
      {
        _id: request.params.serviceId,
      },
      { dropDownnNames: 1, _id: 0 }
    );
    let isThereDropDown = false;
    for (let item of dropDownNames.dropDownnNames) {
      if (item._id == request.body.dropDownnNameId) {
        isThereDropDown = true;
      }
    }
    if (!isThereDropDown) {
      throw ErrorMessage(404, "there is no dropdown with this id ");
    }
    const updatedService = await ServicesModel.updateOne(
      { _id: request.params.serviceId },
      { $push: { variations: request.body } }
    );
    if (updatedService.matchedCount == 0) {
      throw ErrorMessage(404, "service id doesn't exist 🙄");
    }
    response
      .status(201)
      .json({ message: "variation is posted to service successfully..!" });
  }
);

export const getServiceVariations = catchError(
  async (request, response, next) => {
    const service = await ServicesModel.findOne(
      {
        _id: request.params.serviceId,
      },
      { variations: 1, _id: 0 }
    ).populate({
      path: "dropDownnNameId",
    });
    if (!service) {
      throw ErrorMessage(404, "no services found for this category");
    }
    response.status(200).json(service.variations);
  }
);

export const editServiceVariation = catchError(
  async (request, response, next) => {
    if (request.file) {
      request.body.largeImage = request.file.dest;
    }
    if (request.body.dropDownnNameId) {
      const dropDownNames = await ServicesModel.findOne(
        {
          _id: request.params.serviceId,
        },
        { dropDownnNames: 1, _id: 0 }
      );
      let isThereDropDown = false;
      for (let item of dropDownNames.dropDownnNames) {
        if (item._id == request.body.dropDownnNameId) {
          isThereDropDown = true;
        }
      }
      if (!isThereDropDown) {
        throw ErrorMessage(404, "there is no dropdown with this id ");
      }
    }
    const query = {
      _id: request.params.serviceId,
      "variations._id": request.params.variationId,
    };
    const update = { $set: {} };
    for (const field in request.body) {
      update.$set[`variations.$.${field}`] = request.body[field];
    }
    const updatedService = await ServicesModel.updateOne(query, update);
    if (updatedService.matchedCount == 0) {
      throw ErrorMessage(404, "Service or variation ID doesn't exist 🙄");
    }
    response
      .status(201)
      .json({ message: "variation is updated successfully..!" });
  }
);
export const deleteServiceVariation = catchError(
  async (request, response, next) => {
    const variationId = request.params.variationId;
    const query = {
      _id: request.params.serviceId,
      "variations._id": variationId,
    };
    const update = {
      $pull: { variations: { _id: variationId } },
    };
    const updatedService = await ServicesModel.updateOne(query, update);
    if (updatedService.matchedCount === 0) {
      throw ErrorMessage(404, "Service or variation ID doesn't exist 🙄");
    }

    response
      .status(201)
      .json({ message: "Service variation deleted successfully..!" });
  }
);

export const addDetailsItem = catchError(async (request, response, next) => {
  let update = {};
  if (request.params.position === "left") {
    update = { $push: { leftDetailsItems: request.body } };
  } else {
    update = { $push: { rightDetailsItems: request.body } };
  }
  const updatedService = await ServicesModel.updateOne(
    { _id: request.params.serviceId },
    update
  );
  if (updatedService.matchedCount == 0) {
    throw ErrorMessage(404, "service id doesn't exist 🙄");
  }
  response.status(201).json({
    message: `details is posted to ${request.params.position} successfully..!`,
  });
});

export const updateDetailsItem = catchError(async (request, response, next) => {
  let update = {};
  let query = {};
  if (request.params.position === "left") {
    query = {
      _id: request.params.serviceId,
      "leftDetailsItems._id": request.params.itemId,
    };
    update = {
      $set: {
        "leftDetailsItems.$.content": request.body.content,
      },
    };
  } else {
    query = {
      _id: request.params.serviceId,
      "rightDetailsItems._id": request.params.itemId,
    };
    update = {
      $set: {
        "rightDetailsItems.$.content": request.body.content,
      },
    };
  }
  const updatedService = await ServicesModel.updateOne(query, update);
  if (updatedService.matchedCount == 0) {
    throw ErrorMessage(404, "Service or item ID doesn't exist 🙄");
  }
  response
    .status(201)
    .json({ message: "details item is updated successfully..!" });
});
export const deleteDetailsItem = catchError(async (request, response, next) => {
  let update = {};
  let query = {};
  if (request.params.position === "left") {
    query = {
      _id: request.params.serviceId,
      "leftDetailsItems._id": request.params.itemId,
    };
    update = {
      $pull: { leftDetailsItems: { _id: request.params.itemId } },
    };
  } else {
    query = {
      _id: request.params.serviceId,
      "rightDetailsItems._id": request.params.itemId,
    };
    update = {
      $pull: { rightDetailsItems: { _id: request.params.itemId } },
    };
  }
  const updatedService = await ServicesModel.updateOne(query, update);
  if (updatedService.matchedCount == 0) {
    throw ErrorMessage(404, "Service or item ID doesn't exist 🙄");
  }
  response
    .status(201)
    .json({ message: "details item is updated successfully..!" });
});

export const addProject = catchError(async (request, response, next) => {
  const project = await Projects.findOne({
    _id: request.body.projectId,
  });
  if (!project) {
    throw ErrorMessage(404, "No such project id exists");
  }

  const updatedService = await ServicesModel.updateOne(
    { _id: request.params.serviceId },
    { $addToSet: { oldWork: request.body.projectId } }
  );
  if (updatedService.matchedCount == 0) {
    throw ErrorMessage(404, "service id doesn't exist 🙄");
  }
  response
    .status(201)
    .json({ message: "project is posted to old work successfully..!" });
});

export const deleteProject = catchError(async (request, response, next) => {
  const updatedService = await ServicesModel.updateOne(
    { _id: request.params.serviceId },
    { $pull: { oldWork: request.body.projectId } }
  );
  if (updatedService.matchedCount == 0) {
    throw ErrorMessage(404, "service id doesn't exist 🙄");
  }
  response
    .status(201)
    .json({ message: "project is deleted from old work successfully..!" });
});

export const addDropDown = catchError(async (request, response, next) => {
  const updatedService = await ServicesModel.updateOne(
    { _id: request.params.serviceId },
    { $push: { dropDownnNames: request.body } }
  );
  if (updatedService.matchedCount == 0) {
    throw ErrorMessage(404, "service id doesn't exist 🙄");
  }
  response
    .status(201)
    .json({ message: "dropDownnNames is posted to service successfully..!" });
});

export const editDropDown = catchError(async (request, response, next) => {
  const query = {
    _id: request.params.serviceId,
    "dropDownnNames._id": request.params.dropdId,
  };
  const update = { $set: {} };
  for (const field in request.body) {
    update.$set[`dropDownnNames.$.${field}`] = request.body[field];
  }
  const updatedService = await ServicesModel.updateOne(query, update);
  if (updatedService.matchedCount == 0) {
    throw ErrorMessage(404, "Service or dropDownnNames ID doesn't exist 🙄");
  }
  response
    .status(201)
    .json({ message: "dropDownnNames is updated successfully..!" });
});

export const deleteDropDown = catchError(async (request, response, next) => {
  const dropDownId = request.params.dropdId;
  const query = {
    _id: request.params.serviceId,
    "dropDownnNames._id": dropDownId,
  };
  const update = {
    $pull: { dropDownnNames: { _id: dropDownId } },
  };
  const updatedService = await ServicesModel.updateOne(query, update);
  if (updatedService.matchedCount === 0) {
    throw ErrorMessage(404, "Service or variation ID doesn't exist 🙄");
  }

  response
    .status(201)
    .json({ message: "drop Downn Name  deleted successfully..!" });
});

export const getDropDown = catchError(async (request, response, next) => {
  const service = await ServicesModel.findOne(
    {
      _id: request.params.serviceId,
    },
    { dropDownnNames: 1, _id: 0 }
  );
  if (!service) {
    throw ErrorMessage(404, "no services found for this category");
  }
  response.status(200).json(service.dropDownnNames);
});

export const addMixedPrice = catchError(async (request, response, next) => {
  const variations = await ServicesModel.findOne(
    {
      _id: request.params.serviceId,
    },
    { variations: 1, _id: 0 }
  );
  let isThereDropDown = request.body.variationsId.length;
  for (let variation of variations.variations) {
    for (let mixId of request.body.variationsId)
      if (mixId == variation._id) {
        isThereDropDown -= 1;
      }
  }
  if (isThereDropDown !== 0) {
    throw ErrorMessage(404, "there is error in categories ids ");
  }
  const updatedService = await ServicesModel.updateOne(
    { _id: request.params.serviceId },
    { $push: { mixedPrices: request.body } }
  );
  if (updatedService.matchedCount == 0) {
    throw ErrorMessage(404, "service id doesn't exist 🙄");
  }
  const mixedPrices = await ServicesModel.findOne(
    {
      _id: request.params.serviceId,
    },
    { mixedPrices: 1, _id: 0 }
  );
  response.status(201).json(mixedPrices);
});

export const getMixedPrice = catchError(async (request, response, next) => {
  const service = await ServicesModel.findOne(
    {
      _id: request.params.serviceId,
    },
    { mixedPrices: 1, _id: 0 }
  );
  if (!service) {
    throw ErrorMessage(404, "no services found for this category");
  }
  response.status(200).json(service.mixedPrices);
});

export const editMixedPrice = catchError(async (request, response, next) => {
  if (request.body.variationsId) {
    const variations = await ServicesModel.findOne(
      {
        _id: request.params.serviceId,
      },
      { variations: 1, _id: 0 }
    );
    let isThereDropDown = request.body.variationsId.length;

    for (let variation of variations.variations) {
      for (let mixId of request.body.variationsId)
        if (mixId == variation._id) {
          isThereDropDown -= 1;
        }
    }
    if (isThereDropDown !== 0) {
      throw ErrorMessage(404, "there is error in categories ids ");
    }
  }
  const query = {
    _id: request.params.serviceId,
    "mixedPrices._id": request.params.mxId,
  };
  const update = { $set: {} };
  for (const field in request.body) {
    update.$set[`mixedPrices.$.${field}`] = request.body[field];
  }
  const updatedService = await ServicesModel.updateOne(query, update);
  if (updatedService.matchedCount == 0) {
    throw ErrorMessage(404, "Service or variation ID doesn't exist 🙄");
  }
  response
    .status(201)
    .json({ message: "mixedPrices is updated to service successfully..!" });
});
export const deleteMixedPrice = catchError(async (request, response, next) => {
  const mixedPriceId = request.params.mxId;
  const query = {
    _id: request.params.serviceId,
    "mixedPrices._id": mixedPriceId,
  };
  const update = {
    $pull: { mixedPrices: { _id: mixedPriceId } },
  };
  const updatedService = await ServicesModel.updateOne(query, update);
  if (updatedService.matchedCount === 0) {
    throw ErrorMessage(404, "Service or variation ID doesn't exist 🙄");
  }

  response
    .status(201)
    .json({ message: "mixed Price   deleted successfully..!" });
});
