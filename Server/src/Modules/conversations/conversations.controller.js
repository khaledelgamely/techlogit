import { Conversations } from "./conversations.model.js";
import { ErrorMessage } from "../../utils/ErrorMessage.js";
import { catchError } from "../../utils/catchAsyncError.js";
import { ApiFeature } from "../../utils/ApiFeature.js";
import { Messages } from "../messages/messages.model.js";
import { OrdersModel } from "../orders/orders.model.js";

export const getAll = catchError(async (request, response, next) => {
  const apiFeature = new ApiFeature(
    Conversations.find({ client: request.params.userId })
      .sort({
        lastMessageOn: -1,
      })
      // .populate({
      //   path: "client",
      //   select: { password: 0 },
      // })
      .populate({
        path: "order",
      }),
    request.query
  );
  apiFeature.mongooseQuery
    .then((docs) => {
      if (!docs) {
        response.status(200).json({ data: [], page: apiFeature.page });
      }
      response.status(200).json({ data: docs, page: apiFeature.page });
    })
    .catch((err) => next(err));
});

export const adminGetAll = catchError(async (request, response, next) => {
  const apiFeature = new ApiFeature(
    Conversations.find()
      .sort({
        lastMessageOn: -1,
      })
      .populate({
        path: "order",
      })
      .populate({
        path: "client",
      }),
    request.query
  );
  apiFeature.mongooseQuery
    .then((docs) => {
      if (!docs) {
        response.status(200).json({ data: [], page: apiFeature.page });
      }
      response.status(200).json({ data: docs, page: apiFeature.page });
    })
    .catch((err) => next(err));
});

export const openConversation = catchError(async (request, response, next) => {
  Conversations.findOne({
    client: request.params.userId,
    order: request.body.order,
  })
    // .populate({
    //   path: "client",
    //   select: { password: 0 },
    // })
    .populate({
      path: "order",
    })
    .then(async (conversationDoc) => {
      if (!conversationDoc) {
        const order = await OrdersModel.findOne({
          _id: request.body.order,
          user: request.params.userId,
        });
        if (!order) {
          throw ErrorMessage(404, "No such order id exists");
        }
        new Conversations({
          ...request.body,
          lastMessageOn: Date.now(),
          client: request.params.userId,
        })
          .save()
          .then((conversationDoc) => {
            if (!conversationDoc) {
              throw ErrorMessage(
                404,
                "can't add this conversation check your data"
              );
            }
            // console.log("conversation created");
            // response.status(200).json(conversationDoc);
            return (
              Conversations.findById(conversationDoc._id)
                // .populate({
                //   path: "client",
                //   select: { password: 0 },
                // })
                .populate({
                  path: "order",
                })
            );
          })
          .then((docs) => {
            if (!docs) {
              throw ErrorMessage(404, "there're no conversation  to show");
            }

            response.status(200).json(docs);
          })
          .catch((err) => {
            next(err);
          });
      } else {
        response.status(200).json(conversationDoc);
      }
    })
    .catch((err) => {
      next(err);
    });
});
export const makeConvoMessagesSeen = catchError(
  async (request, response, next) => {
    Messages.updateMany(
      {
        conversation: request.body.convId,
        sender: { $ne: request.params.userId },
        seen: false,
      },
      { $set: { seen: true } }
    )
      .then((doc) => {
        response.status(201).json({ message: "messages updated successfully" });
      })
      .catch((err) => {
        next(err);
      });
  }
);
export const adminMakeConvoMessagesSeen = catchError(
  async (request, response, next) => {
    Messages.updateMany(
      {
        conversation: request.body.convId,
        isFromAdmin: false,
        seen: false,
      },
      { $set: { seen: true } }
    )
      .then((doc) => {
        response.status(201).json({ message: "messages updated successfully" });
      })
      .catch((err) => {
        next(err);
      });
  }
);
export const getUnseenConversations = catchError(
  async (request, response, next) => {
    let unseenConversations = [];
    const conversations = await Conversations.find(
      { client: request.params.userId },
      { _id: 1 }
    );
    if (conversations.length === 0) {
      response.status(201).json({ unseenConversations });
    }
    for (const conversation of conversations) {
      const unseenMessages = await Messages.find({
        conversation: conversation._id,
        sender: { $ne: request.params.userId },
        seen: false,
      });
      if (unseenMessages.length !== 0) {
        unseenConversations.push(conversation._id);
      }
    }
    response.status(201).json({ unseenConversations });
  }
);
export const adminGetUnseenConversations = catchError(
  async (request, response, next) => {
    console.log("here");
    let unseenConversations = [];
    const conversations = await Conversations.find({}, { _id: 1 });
    if (conversations.length === 0) {
      throw ErrorMessage(404, "No conversations found");
    }
    for (const conversation of conversations) {
      const unseenMessages = await Messages.find({
        conversation: conversation._id,
        isFromAdmin: false,
        seen: false,
      });
      if (unseenMessages.length !== 0) {
        unseenConversations.push(conversation._id);
      }
    }
    response.status(201).json({ unseenConversations });
  }
);
export const addNote = catchError(async (request, response, next) => {
  await Conversations.updateOne(
    { _id: request.params.convId },
    { $push: { userNotes: request.body.content } }
  );
  response.status(201).json({ message: "note is posted successfully..!" });
});
export const addminAddNote = catchError(async (request, response, next) => {
  await Conversations.updateOne(
    { _id: request.params.convId },
    { $push: { adminNotes: request.body.content } }
  );
  response.status(201).json({ message: "note is posted successfully..!" });
});
