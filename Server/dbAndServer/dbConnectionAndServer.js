import mongoose from "mongoose";
import dotenv from "dotenv";
import { Server } from "socket.io";
dotenv.config();

const dbConnectionAndServer = (app) => {
  return mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected successfully to DB");
      const expressServer = app.listen(process.env.PORT || 5000, () =>
        console.log(`Server listening on port ${process.env.PORT || 5000}`)
      );
      // const io = new Server(expressServer, {
      //   cors: {
      //     origin: [
      //       "https://dashboard.techlogit.com",
      //       "https://techlogit.com",
      //       "https://dashboard.techlogit.com/",
      //       "https://techlogit.com/",
      //       "https://techlogit.com/api",
      //     ],
      //     credentials: true,
      //     allowedHeaders: [
      //       "Access-Control-Allow-Origin",
      //       "Access-Control-Allow-Credentials",
      //       "Content-Type",
      //       "Authorization",
      //       "X-Requested-With",
      //       "Origin",
      //       "Accept",
      //       "Accept-Version",
      //       "Content-Length",
      //       "Content-MD5",
      //       "Date",
      //       "X-Api-Version",
      //     ],
      //     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      //   },
      // });
      const io = new Server(expressServer, {
        cors: {
          origin: "*",
        },
      });
      // const io = new Server(expressServer, {
      //   cors: {
      //     origin: ['https://dashboard.techlogit.com','https://techlogit.com','https://dashboard.techlogit.com/','https://techlogit.com/','https://techlogit.com/api'],
      //     credentials: true,
      //     allowedHeaders: ['Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials', 'Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept', 'Accept-Version', 'Content-Length', 'Content-MD5', 'Date', 'X-Api-Version'],
      //     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      //   },
      // });

      // const server = http.createServer(app);
      // const io = new Server(server);
      // ###_socketfunctions_#############################

      let users = [];
      let admins = [];
      const addUser = (userId, socketId) => {
        const userExists = users.some((user) => user.userId === userId);
        if (!userExists) {
          users.push({ userId, socketId });
        } else {
          users.forEach((user) => {
            if (user.userId === userId) {
              user.socketId = socketId;
            }
          });
        }
      };
      const addAdmin = (userId, socketId) => {
        const userExists = admins.some((user) => user.userId === userId);
        if (!userExists) {
          admins.push({ userId, socketId });
        } else {
          admins.forEach((user) => {
            if (user.userId === userId) {
              user.socketId = socketId;
            }
          });
        }
      };
      // const removeUser = (socketId) => {
      //   users = users.filter((user) => user.socketId !== socketId);
      // };
      const removeUser = (socketId) => {
        const userIndex = users.findIndex((user) => user.socketId === socketId);
        if (userIndex !== -1) {
          // Remove the user from the 'users' array
          users.splice(userIndex, 1);
          return;
        }
        const adminIndex = admins.findIndex(
          (admin) => admin.socketId === socketId
        );

        if (adminIndex !== -1) {
          admins.splice(adminIndex, 1);
        }
      };
      const getUser = (userId) => {
        return users.find((user) => user.userId === userId);
      };

      // ###_socketlisteners_#############################

      io.on("connection", (socket) => {
        console.log("A user connected.", socket.id);
        socket.on("addUser", (userId, isAdmin) => {
          if (isAdmin) {
            addAdmin(userId, socket.id);
          } else {
            addUser(userId, socket.id);
          }
          io.emit("getUsers", users);
          console.log("A user added.", socket.id);
          console.log("users", users);
          console.log("admins", admins);
        });

        socket.on("sendMessageToUser", ({ message, receiverId, adminId }) => {
          const user = getUser(receiverId);
          console.log("send to user", user, receiverId, admins);
          admins.forEach((admin) => {
            console.log("asdasdasd", admin, adminId);
            if (admin.userId != adminId) {
              io.to(admin.socketId).emit(
                "sendMessageFromAdminToAdmin",
                message
              );
            }
          });
          if (user) {
            io.to(user.socketId).emit("getMessageFromAdmin", message);
          } else {
            console.log("User not found.");
          }
        });

        socket.on("sendMessageToAdmins", (message) => {
          admins.forEach((admin) => {
            io.to(admin.socketId).emit("getMessageFromUser", message);
          });
        });
        socket.on("adminOpenedChat", (conv) => {
          admins.forEach((admin) => {
            io.to(admin.socketId).emit("makeChatSeen", conv);
          });
        });
        socket.on("disconnect", () => {
          removeUser(socket.id);
          io.emit("getUsers", users);
          console.log("A user disconnected.", socket.id);
        });
      });
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });
};

export { dbConnectionAndServer };
