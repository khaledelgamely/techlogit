import { Messages } from "./messages.model.js";
import { ErrorMessage } from "../../utils/ErrorMessage.js";
import { catchError } from "../../utils/catchAsyncError.js";
import { ApiFeature } from "../../utils/ApiFeature.js";
import { Conversations } from "../conversations/conversations.model.js";

export const getConvoMessages = catchError(async (request, response, next) => {
  const apiFeature = new ApiFeature(
    Messages.find({ conversation: request.params.convId })
      .sort({ _id: -1 })
      .populate({
        path: "sender",
        select: { password: 0 },
      }),
    request.query
  );
  apiFeature.mongooseQuery // .paginate()
    .then((docs) => {
      if (!docs) {
        throw ErrorMessage(404, "there're no Messages  to show");
      }

      response.status(200).json({
        data: docs,
        page: apiFeature.page,
        conversation: request.params.convId,
      });
    })
    .catch((err) => next(err));
});

export const addNewMessage = catchError(async (request, response, next) => {
  const conversation = await Conversations.findOne({
    _id: request.body.conversation,
  });
  if (!conversation) {
    throw ErrorMessage(404, "No such conversation id exists");
  }
  for (const file in request.files) {
    let [image] = request.files[file];
    request.body[file] = image.dest;
  }

  const newMessage = await new Messages(request.body);
  await newMessage.save();
  await newMessage.populate({
    path: "sender",
    select: { password: 0 },
  });

  if (!newMessage) {
    throw ErrorMessage(404, "error creating your message");
  }
  await Conversations.updateOne(
    { _id: request.body.conversation },
    {
      lastMessageOn: Date.now(),
      lastMessage: {
        // content: request.body.content || "",
        content:
          request.body.msgType === "text"
            ? request.body.content
            : request.body.msgType,
        isFromAdmin: false,
      },
    }
  );
  response.status(200).json(newMessage);
});

export const adminAddNewMessage = catchError(
  async (request, response, next) => {
    const conversation = await Conversations.findOne({
      _id: request.body.conversation,
    });
    if (!conversation) {
      throw ErrorMessage(404, "No such conversation id exists");
    }
    for (const file in request.files) {
      let [image] = request.files[file];
      request.body[file] = image.dest;
    }

    const newMessage = await new Messages({
      ...request.body,
      isFromAdmin: true,
    });
    await newMessage.save();
    await newMessage.populate({
      path: "sender",
      select: { password: 0 },
    });

    if (!newMessage) {
      throw ErrorMessage(404, "error creating your message");
    }
    await Conversations.updateOne(
      { _id: request.body.conversation },
      {
        lastMessageOn: Date.now(),
        lastMessage: {
          content: request.body.content || "",
          isFromAdmin: true,
        },
      }
    );
    response.status(200).json(newMessage);
  }
);

export const getFiles = catchError(async (request, response, next) => {
  const messages = await Messages.find({
    conversation: request.params.convId,
    msgType: { $ne: "text" },
  }).populate({
    path: "sender",
    select: { password: 0 },
  });
  response.status(200).json(messages);
});
