import { UserModel } from "../../Modules/user/user.model.js";
import { ErrorMessage } from "../../utils/ErrorMessage.js";
import { catchError } from "../../utils/catchAsyncError.js";
import { sendGrid } from "../../utils/sendGrid.js";
import crypto from "crypto";
import {
  generateToken,
  verifyToken,
} from "../../utils/GenerateAndVerifyToken.js";

import { customAlphabet } from "nanoid";

export const signUp = catchError(async (request, response, next) => {
  const { password, email } = request.body;
  if (await UserModel.findOne({ email })) {
    throw ErrorMessage(409, "Account Already Exist 🙄");
  }
  const token = generateToken({ payload: { email }, expiresIn: 60 * 60 * 5 });
  const refreshToken = generateToken({
    payload: { email },
    expiresIn: 60 * 60 * 24 * 30,
  });
  const link = `${request.protocol}://${request.headers.host}/api/auth/confirmEmail/${token}`;
  const refreshLink = `${request.protocol}://${request.headers.host}/api/auth/newConfirmEmail/${refreshToken}`;

  await sendGrid({
    to: email,
    from: process.env.AUTH_SENDER_EMAIL,
    subject: "confirmation email ",
    templateId: process.env.CONF_TEMPLATE_ID,
    data: { link, refreshLink },
  });

  if (request.file) {
    request.body.profilePic = request.file.dest;
  }
  const user = await new UserModel(request.body).save();
  if (!user) {
    throw ErrorMessage(404, "No User Added Check Your Data 🙄");
  }
  response
    .status(201)
    .json({ message: "success check your email for verification" });
});
//###########################comfirm email####
export const confirmEmail = catchError(async (request, response, next) => {
  const { token } = request.params;
  const { email } = verifyToken({ token });
  if (!email) {
    throw Error("invalid token payload", { cause: 400 });
  }
  const user = await UserModel.findOneAndUpdate(
    { email },
    { confirmEmail: true },
    { new: true }
  );
  if (user) {
    const accessToken = generateToken({
      payload: { email, role: user.role, id: user._id },
      expiresIn: 60 * 60,
    });
    await sendGrid({
      to: user.email,
      from: process.env.AUTH_SENDER_EMAIL,
      templateId: process.env.WELCOME_USER_TEMPLATE_ID,
      subject: "wellcome new user",
      data: { user: user.firstName },
    });
    response.cookie("token", accessToken, {
      secure: true, // Ensure this is set to true if you're using HTTPS
      sameSite: "strict", // Strict sameSite setting for additional security
      expires: new Date(Date.now() + 3600000), // 1 hour from now
    });

    return response.status(200).redirect("https://techlogit.com/");
  } else {
    throw Error("not registered account", { cause: 404 });
  }
});

export const requestNewConfirmEmail = catchError(
  async (request, response, next) => {
    const { token } = request.params;
    const { email } = verifyToken({ token });
    if (!email) {
      throw Error("invalid token payload", { cause: 400 });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ErrorMessage(404, "not registered account 🙄");
    }
    if (user.confirmEmail) {
      return response.status(200).redirect("https://techlogit.com/");
    }
    const newToken = generateToken({
      payload: { email },
      expiresIn: 60 * 60 * 5,
    });
    const link = `${request.protocol}://${request.headers.host}/api/auth/confirmEmail/${newToken}`;
    const refreshLink = `${request.protocol}://${request.headers.host}/api/auth/newConfirmEmail/${token}`;

    await sendGrid({
      to: email,
      from: process.env.AUTH_SENDER_EMAIL,
      subject: "confirmation email ",
      templateId: process.env.CONF_TEMPLATE_ID,
      data: { link, refreshLink },
    });

    return response
      .status(201)
      .json({ message: "new confirmation email is sent to your email" });
  }
);

export const signIn = catchError(async (request, response, next) => {
  const { password, email } = request.body;

  const user = await UserModel.findOne({ email: email }).select("+password");

  if (!user) {
    throw ErrorMessage(404, "not registerd account  🙄");
  }
  if (!user.confirmEmail) {
    const token = generateToken({ payload: { email }, expiresIn: 60 * 60 * 5 });
    const refreshToken = generateToken({
      payload: { email },
      expiresIn: 60 * 60 * 24 * 30,
    });
    const link = `${request.protocol}://${request.headers.host}/api/auth/confirmEmail/${token}`;
    const refreshLink = `${request.protocol}://${request.headers.host}/api/auth/newConfirmEmail/${refreshToken}`;

    await sendGrid({
      to: email,
      from: process.env.AUTH_SENDER_EMAIL,
      subject: "confirmation email ",
      templateId: process.env.CONF_TEMPLATE_ID,
      data: { link, refreshLink },
    });

    throw ErrorMessage(
      401,
      "sorry you have to confirm your email first ,new confirmation email is sent to your email "
    );
  }
  if (user.suspend) {
    throw ErrorMessage(401, "sorry you have been suspended by admin  🙄");
  }

  if (await user.isCorrectPassowrd(password, user.password)) {
    const accessToken = generateToken({
      payload: { email, role: user.role, id: user._id },
      expiresIn: 60 * 60,
    });
    const refreshToken = generateToken({
      payload: { email, role: user.role, id: user._id },
      expiresIn: 60 * 60 * 24 * 365,
    });
    user.status = "online";
    await user.save();
    return response
      .status(200)
      .json({ message: "success", accessToken, refreshToken });
  } else {
    throw ErrorMessage(404, "not registered account 🙄");
  }
});

export const forgetPassword = catchError(async (request, response, next) => {
  const { email, resetCode, password } = request.body;
  const user = await UserModel.findOne({ email: email });
  if (!user) {
    throw ErrorMessage(404, "invalid Email 🙄");
  }
  if (user.resetCode !== resetCode) {
    throw ErrorMessage(404, "sorry there's invalid reset code 🙄");
  }

  user.password = password;
  user.resetCode = "";
  user.changePasswordAt = Date.now();
  const updatedUser = await user.save();
  return updatedUser
    ? response
        .status(200)
        .json({ message: "success .. password changed successfully" })
    : next(ErrorMessage(404, "check your date"));
});

export const sendVerificationCode = catchError(
  async (request, response, next) => {
    const { email } = request.body;
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      throw ErrorMessage(404, "A user with this Email does not exist");
    }

    if (user.codeRequestMaxNumber == 0) {
      throw ErrorMessage(
        404,
        "Sorry You Have Reached The Maximum Number Of Reset Code Per Day"
      );
    }
    const verficationCode = customAlphabet(process.env.CUSTOMALPHAPIT, 5)();

    await sendGrid({
      to: email,
      from: process.env.AUTH_SENDER_EMAIL,
      subject: "verification Code ",
      templateId: process.env.SEND_CODE_TEMPLATE_ID,
      data: {
        code: verficationCode,
        link: `https://techlogit.com/forget_password/${email}/${verficationCode}`,
      },
    });

    const updatedUser = await UserModel.findOneAndUpdate(
      { email: email },
      {
        $set: { resetCode: verficationCode },
        $inc: { codeRequestMaxNumber: -1 },
      },
      { new: true }
    );
    return updatedUser
      ? response.status(200).json({
          message: "success",
          //  code: updatedUser.resetCode
        })
      : next(ErrorMessage(404, "check your data"));
  }
);

export const changePassword = catchError(async (request, response, next) => {
  const { oldPassword, password } = request.body;
  const { email } = request.decoded;

  const user = await UserModel.findOne({ email: email }).select("+password");

  if (!user) {
    throw ErrorMessage(404, "Not Registred Account");
  }

  if (user.isCorrectPassowrd(oldPassword, user.password)) {
    user.passwordChangedAt = Date.now();
    user.status = "offline";

    await user.save();

    return response
      .status(200)
      .json({ message: "success password changed successfully" });
  } else {
    throw ErrorMessage(404` oldPassword is wrong `);
  }
});

export const loginWithProvider = catchError(async function (req, res) {
  let accessToken = req.user.accessToken;
  res.cookie("token", accessToken, {
    secure: true, // Ensure this is set to true if you're using HTTPS
    sameSite: "strict", // Strict sameSite setting for additional security
    expires: new Date(Date.now() + 3600000), // 1 hour from now
  });

  // Send a message to the parent window
  res.setHeader("Content-Security-Policy", "script-src 'self' 'unsafe-inline'");
  const script = `
  <script>
  localStorage.setItem('authenticated', 'true');
   window.close();
  </script>
`;

  res.status(200).send(`
    <html>
    <body>
    ${script}
    </body>
    </html>
  `); // Successful authentication, redirect home.
});

export const loginWithProviderFailed = catchError(async (request, response) => {
  response.redirect("https://techlogit.com/");
  // throw ErrorMessage(401, "sorry authentication with google failed try again");
});
