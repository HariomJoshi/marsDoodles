const users = [];

const addUser = (user) => {
  //   const user = { name, roomId, isHost, isPresenter, socketID }; // NOTE: isHost and isPresenter are boolean
  console.log("User added");
  users.push(user);
};

// it will take the socketId of the user and
const removeUser = (id) => {
  const index = users.findIndex((user) => {
    // user.socketID === id;
    user.email === id;
  }); // if not found so it will return -1
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

//getting a user from id, it will return an object containing all the details of the user
const getUser = (id) => {
  return users.find((user) => {
    // return user.socketID === id;
    return user.email === id;
  });
};

//getting all users in the room
const getUsersInRoom = (roomId) => {
  return users.filter((user) => {
    // console.log(`user ki room id: ${user.roomId} and room Id passed ${roomId}`);
    return user.roomId === roomId;
  });
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
