import cron from "node-cron";
import { UserModel } from "../../Modules/user/user.model.js";
export const resetUserMaxCodeRequest = () => {
  cron.schedule("0 0 * * *", async () => {
    await UserModel.updateMany({}, { codeRequestMaxNumber: 5 });
    // console.log("Running a task every kareem minute");
    // Your code here
  });
};
