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
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};
const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};
