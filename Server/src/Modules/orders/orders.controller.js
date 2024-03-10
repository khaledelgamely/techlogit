import { OrdersModel } from "./orders.model.js";
import { ErrorMessage } from "../../utils/ErrorMessage.js";
import { catchError } from "../../utils/catchAsyncError.js";
import { sendGrid } from "../../utils/sendGrid.js";
import { ServicesModel } from "../services/services.model.js";
import { UserModel } from "../user/user.model.js";
import { Conversations } from "../conversations/conversations.model.js";
import { Messages } from "../messages/messages.model.js";
import mongoose from "mongoose";
export const createOrder = catchError(async (request, response, next) => {
  const { service } = request.body;
  const { id, email, firstName, lastName } = request.decoded;
  request.body.user = id;
  const searchedservice = await ServicesModel.findOne({ _id: service });
  if (!searchedservice) {
    throw ErrorMessage(404, "service doesn't exist");
  }

  const order = await OrdersModel.create(request.body);

  const updatedUser = await UserModel.findByIdAndUpdate(
    id,
    { $addToSet: { orders: order._id } },
    { new: true }
  );


  const { chossen } = order;
  let variantName = "default variant";

  if (chossen.length > 0) {
    variantName = chossen
      .flatMap((item) => Object.values(item).map((subItem) => subItem.title))
      .map((obj) => {
        return Object.entries(obj)
          .map(([key, value]) => {
            // console.log(`${key} ${value}`);
            return `${key} ${value}`;
          })
          .join(" ");
      })
      .join(" ");
  }

  await sendGrid({
    to: email,
    from: process.env.ORDER_SENDER_EMAIL,
    subject: "order creation ",
    templateId: process.env.ORDER_CREATED_TEMPLATE_ID,
    data: {
      orderID: order._id,
      userName: `${firstName} ${lastName}`,
      serviceName: order.title,
      variationName: variantName,
    },
  });

  await sendGrid({
    to: process.env.INFO_RECEIVER_EMAIL,
    from: process.env.ORDER_SENDER_EMAIL,
    subject: "order creation ",
    templateId: process.env.ADMIN_ORDER_CREATED_TEMPLATE_ID,
    data: {
      orderID: order._id,
      userName: `${firstName} ${lastName}`,
      email,
      variationName: variantName,
      serviceName: order.title,
    },
  });

  if (order) {
    response.status(201).json({ msg: "order created successfully", order });
  } else {
    throw ErrorMessage(404, "order creation failed");
  }
});

export const updateOrderStatus = catchError(async (request, response, next) => {
  const { id } = request.params;
  const { id: userId, email, firstName, lastName } = request.decoded;

  const order = await OrdersModel.findById(id).populate({
    path: "user",
    select: { email: 1, firstName: 1, lastName: 1 },
  });

  if (!order) {
    throw ErrorMessage(404, "Order not found");
  }
  if (order.payment === "unpaid") {
    throw ErrorMessage(401, "Order status can't be updated before purchase");
  }
  request.body.updatedBy = userId;
  const updatedOrder = await OrdersModel.updateOne({ _id: id }, request.body);
  if (updatedOrder) {
    const { chossen } = order;
    let variantName = "default variant";

    if (chossen.length > 0) {
      variantName = chossen
        .flatMap((item) => Object.values(item).map((subItem) => subItem.title))
        .map((obj) => {
          return Object.entries(obj)
            .map(([key, value]) => {
              // console.log(`${key} ${value}`);
              return `${key} ${value}`;
            })
            .join(" ");
        })
        .join(" ");
    }
    await sendGrid({
      to: order.user.email,
      from: process.env.ORDER_SENDER_EMAIL,
      subject: "order creation ",
      templateId: process.env.ORDER_STATUS_INFO_USER_CHANGED_TEMPLATE_ID,
      data: {
        orderID: order._id,
        userName: `${order.user.firstName} ${order.user.lastName}`,
        status: request.body.status,
        variationName: variantName,
        serviceName: order.title,
      },
    });


    await sendGrid({
      to: process.env.INFO_RECEIVER_EMAIL,
      from: process.env.ORDER_SENDER_EMAIL,
      subject: "order creation ",
      templateId: process.env.ORDER_STATUS_INFO_ADMIN_CHANGED_TEMPLATE_ID,
      data: {
        orderID: order._id,
        userName: `admin`,
        status: request.body.status,
        variationName: variantName,
        serviceName: order.title,
        orderUser: `${order.user.firstName} ${order.user.lastName}`,
      },
    });

    response
      .status(200)
      .json({ msg: "order  updated successfully", updatedOrder });
  } else {
    throw ErrorMessage(404, "Order status isn't updated check data ");
  }
});

export const getAllOrders = catchError(async (request, response, next) => {
  const orders = await OrdersModel.find({});
  if (orders.length === 0) {
    throw ErrorMessage(404, "no orders found ");
  }
  response.status(200).json(orders);
});

export const getSingleOrder = catchError(async (request, response, next) => {
  const { id: userId, email, firstName, lastName, role } = request.decoded;
  const order = await OrdersModel.findOne({
    _id: request.params.orderId,
  })
  if (!order) {
    throw ErrorMessage(404, "no order found ");
  }
  if (order.user == userId || role == "admin") {
    response.status(200).json(order);
  } else {
    throw ErrorMessage(401, "you're not authorized to get this order ");
  }
});
/// using mongoose transaction
export const deleteSingleOrder = catchError(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderId } = req.params;

    // Check if the order exists and meets deletion criteria
    const order = await OrdersModel.findById(orderId).session(session);
    if (!order) {
      throw ErrorMessage(404, "Order doesn't exist 🙄");
    }
    if (order.status !== "completed" && order.payment === "paid") {
      throw ErrorMessage(
        403,
        "Sorry, you can't delete this order as it's paid and not completed."
      );
    }

    // Check for associated conversations
    const orderCon = await Conversations.findOne({ order: orderId }).session(
      session
    );

    if (!orderCon) {
      // If no associated conversation, directly delete the order
      const deletedOrder = await OrdersModel.deleteOne({
        _id: orderId,
      }).session(session);

      if (deletedOrder.deletedCount === 0) {
        throw ErrorMessage(404, "Order doesn't exist 🙄");
      }
    } else {
      // If there is an associated conversation, delete messages and conversation
      const deletedMess = await Messages.deleteMany({
        conversation: orderCon._id,
      }).session(session);
      const deletedConvs = await Conversations.deleteOne({
        order: orderId,
      }).session(session);

      console.log(
        "deleted concv ,messs",
        deletedConvs.deletedCount,
        deletedMess.deletedCount
      );
    }

    // Update the user model
    const updatedUser = await UserModel.updateOne(
      { _id: order.user },
      { $pull: { orders: orderId } }
    ).session(session);

    console.log("updated user", updatedUser);

    // Commit the transaction
    await session.commitTransaction();

    return res.status(200).json({ message: "Order deleted successfully!" });
  } catch (error) {
    // If an error occurs, abort the transaction
    await session.abortTransaction();
    next(error);
  } finally {
    // End the session
    session.endSession();
  }
});
/// this code without using mongoose transaction
// export const deleteSingleOrder = catchError(async (request, response, next) => {
//   const { orderId } = request.params;
//   const order = OrdersModel.findById(orderId);
//   if (!order) {
//     throw ErrorMessage(404, "order doesn't exist 🙄");
//   }
//   if (order.status !== "completed" && order.payment == "paid") {
//     throw ErrorMessage(404, " sorry you cant't delete this order  🙄");
//   }

//   const orderCon = await Conversations.findOne({ order: orderId });
//   if (!orderCon) {
//     const deletedOrder = await OrdersModel.deleteOne({
//       _id: orderId,
//     });

//     if (deletedOrder.deletedCount == 0) {
//       throw ErrorMessage(404, "order doesn't exist 🙄");
//     }

//     await UserModel.updateOne(
//       { _id: order.user },
//       { $pull: { orders: orderId } }
//     );
//     return response
//       .status(204)
//       .json({ message: "order is deleted successfully..!" });
//   } else {
//     const deletedMessages = await Messages.deleteMany({
//       conversation: orderCon._id,
//     });

//     const deletedConv = await Conversations.deleteOne({ order: orderId });
//     if (deletedConv.deletedCount !== 0 && deletedMessages.deletedCount !== 0) {
//       const deletedOrder = await OrdersModel.deleteOne({
//         _id: orderId,
//       });

//       if (deletedOrder.deletedCount == 0) {
//         throw ErrorMessage(404, "order doesn't exist 🙄");
//       }

//       await UserModel.updateOne(
//         { _id: order.user },
//         { $pull: { orders: orderId } }
//       );

//       response
//         .status(204)
//         .json({ message: "order is deleted successfully..!" });
//     }
//   }
// });

export const addWorkStatusToOrder = catchError(
  async (request, response, next) => {
    const { id: userId } = request.decoded;
    const workStatus = request.body;

    const order = await OrdersModel.findByIdAndUpdate(
      {
        _id: request.params.id,
      },
      {
        $addToSet: {
          workStatus: workStatus.workStatus,
        },
        updatedBy: userId,
      },
      { new: true }
    );
    if (!order) {
      throw ErrorMessage(404, "no order found ");
    }
    response.status(200).json({ msg: "success", order });
  }
);

export const updateWorkStatusforOrder = catchError(
  async (request, response, next) => {
    const { id: userId } = request.decoded;
    const { _id, title, description, completed } = request.body;

    const order = await OrdersModel.updateOne(
      {
        _id: request.params.id,
        "workStatus._id": _id,
      },
      {
        $set: {
          "workStatus.$.description": description,
          "workStatus.$.completed": completed,
          "workStatus.$.title": title,
          updatedBy: userId,
        },
      }
    );

    if (order.matchedCount == 0) {
      throw ErrorMessage(404, "no order found ");
    }
    response.status(200).json({ msg: "success", order });
  }
);

export const removeOneWorkStatusforOrder = catchError(
  async (request, response, next) => {
    const { id: userId } = request.decoded;
    const { _id } = request.body;

    const order = await OrdersModel.updateOne(
      {
        _id: request.params.id,
        "workStatus._id": _id,
      },
      {
        $pull: {
          workStatus: { _id },
        },
        $set: { updatedBy: userId },
      }
    );

    if (order.matchedCount == 0) {
      throw ErrorMessage(404, "no order found ");
    }
    response.status(200).json({ msg: "success", order });
  }
);

/**
 * 
 * model.update(
    { _id: 1, "items.id": "2" },
    {
        $set: {
            "items.$.name": "yourValue",
            "items.$.value": "yourvalue",
         }
    }
)
 */
