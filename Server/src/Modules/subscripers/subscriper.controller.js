import { SubscripersModel } from "./subscriper.model.js";
import { ErrorMessage } from "../../utils/ErrorMessage.js";
import { catchError } from "../../utils/catchAsyncError.js";
import { sendGridMultiple } from "../../utils/sendGrid.js";
import { sendGrid } from "../../utils/sendGrid.js";
import client from "@sendgrid/client";

// import { ServicesModel } from "../services/services.model.js";
client.setApiKey(process.env.SENDGRID_API_KEY);
export const getAllSubscripers = catchError(async (request, response, next) => {
  const subscripers = await SubscripersModel.find({});
  if (subscripers.length == 0) {
    throw ErrorMessage(404, "no subscripers found");
  }
  response.status(200).json(subscripers);
});

export const addNewSubscriper = catchError(async (request, res, next) => {
  const data = {
    contacts: [
      {
        email: request.body.email,
        // custom_fields: {
        //   w1: "coffee",
        //   w33: "42",
        //   e2: "blue",
        // },
      },
    ],
  };

  const sgRequest = {
    url: `/v3/marketing/contacts`,
    method: "PUT",
    body: data,
  };

  const [response, body] = await client.request(sgRequest);

  // console.log(result.body);
  if (response.statusCode == 202) {
    return res.status(201).json({
      message: " Subscriper Added Successfully 😃",
    });
  }
});

export const addNewGetInTouchAccount = catchError(
  async (request, response, next) => {
    const { name, phone, message, email } = request.body;
    console.log(
      "from",
      process.env.GETINTOUCH_TEMPLATE_ID,
      process.env.AUTH_SENDER_EMAIL
    );
    // let subscriper = await SubscripersModel.findOne({
    //   email: request.body.email,
    // });
    // if (subscriper)
    //   return next(ErrorMessage(409, "Get In Touch Account Already Exist 🙄"));
    let result = new SubscripersModel(request.body);
    result = await result.save();
    if (result) {
      const data = await sendGrid({
        to: process.env.ORDER_SENDER_EMAIL,
        from: process.env.INFO_SENDER_EMAIL,
        subject: "get in touch",
        templateId: process.env.GETINTOUCH_TEMPLATE_ID,
        data: { name, phone, email, message },
      });
      console.log("result", data);
      return response.status(201).json({
        message: "Add  Successfully 😃",
        result,
      });

      // console.error(err.response.body.errors);
      // console.log(err);
    } else {
      throw new ErrorMessage(
        400,
        "Get In Touch Account doesn't created check data you provide"
      );
    }
  }
);
export const broadcastEmailToAllSubscripers = catchError(
  async (request, response, next) => {
    const { from, message } = request.body;
    let ids = await SubscripersModel.find({}).select({ email: 1, _id: 0 });
    if (ids.length == 0) {
      throw ErrorMessage(404, "no subscripers found");
    }

    ids = ids.map((id) => {
      {
        return {
          to: id.email,
          from: from || process.env.AUTH_SENDER_EMAIL,
          dynamicTemplateData: { message },
          templateId: process.env.SUBSCRIPER_TEMPLATE_ID,
          subject: "New Updates from Tech Logit",
        };
      }
    });

    const result = await sendGridMultiple({
      emails: ids,
    });
    // console.log(result);
    response.status(200).json({ message: "email sent successfully" });
  }
);
