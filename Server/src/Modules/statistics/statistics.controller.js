import { ErrorMessage } from "../../utils/ErrorMessage.js";
import { catchError } from "../../utils/catchAsyncError.js";
import { OrdersModel } from "../orders/orders.model.js";
import { ServicesModel } from "../services/services.model.js";
import { UserModel } from "../user/user.model.js";

export const getUserInfo = catchError(async (request, response, next) => {
  const suspendedUserCount = await UserModel.countDocuments({
    suspend: false,
    role: "user",
  });
  const userCount = await UserModel.countDocuments({ role: "user" });
  const activeUserCount = await UserModel.countDocuments({
    suspend: true,
    role: "user",
  });
  const allSystemUserCount = await UserModel.countDocuments();
  const systemAdminCount = await UserModel.countDocuments({ role: "admin" });

  const activeAdminCount = await UserModel.countDocuments({
    suspend: false,
    role: "admin",
  });
  const suspendedAdminCount = await UserModel.countDocuments({
    suspend: true,
    role: "admin",
  });

  const systemTechCount = await UserModel.countDocuments({ role: "tech" });

  const activeTechCount = await UserModel.countDocuments({
    suspend: false,
    role: "tech",
  });
  const suspendedTechCount = await UserModel.countDocuments({
    suspend: true,
    role: "tech",
  });

  response.status(201).json({
    message: "success",
    userStat: {
      allSystemUserCount,
      userCount,
      activeUserCount,
      suspendedUserCount,
      systemAdminCount,
      activeAdminCount,
      suspendedAdminCount,
      systemTechCount,
      activeTechCount,
      suspendedTechCount,
    },
  });
});

export const getServicesInfo = catchError(async (request, response, next) => {
  const servicesCount = await ServicesModel.countDocuments();

  const mostPurchasedService = await OrdersModel.aggregate([
    {
      $group: {
        _id: "$service",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    // { $limit: 1 },
    {
      $lookup: {
        from: "services", // replace with the name of your services collection
        localField: "_id",
        foreignField: "_id",
        as: "service",
      },
    },
    { $unwind: "$service" },
    { $project: { service: 1, count: 1, _id: 0 } },
  ]);

  response.status(201).json({
    message: "success",
    serviceStat: { servicesCount, mostPurchasedService },
  });
});

export const getOrderInfo = catchError(async (request, response, next) => {
  const orderCount = await OrdersModel.countDocuments();
  const paidOrderCount = await OrdersModel.countDocuments({ payment: "paid" });

  const totalMoney = await OrdersModel.aggregate([
    {
      $group: {
        _id: null,
        totalMoney: { $sum: "$totalPrice" },
      },
    },
  ]);

  const groupedMoney = await OrdersModel.aggregate([
    {
      $group: {
        _id: "$payment",
        totalMoney: { $sum: "$totalPrice" },
      },
    },
  ]);

  response.status(201).json({
    message: "success",
    orderStat: {
      orderCount,
      paidOrderCount,
      unpaidOrderCount: orderCount - paidOrderCount,
      totalMoney: totalMoney[0].totalMoney,
      paidOrderMoney: groupedMoney[0],
      unpaidOrderMoney: groupedMoney[1],
    },
  });
});
