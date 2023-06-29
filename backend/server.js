const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const { detectLanguage, translatetext } = require("./controllers/translate");

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: "*",
  },
});

let users = [];
const targetLanguage = "as";

io.on("connection", (socket) => {
  console.log(`User connected id: ${socket.id}`);
  socket.on("join_room", ({ room, name }) => {
    socket.join(room);
    console.log(
      `User with id: ${socket.id} with name: ${name} joined ${room} `
    );
    //This emits the name to all the clients/sockets including the socket that trigerred the join-room event(means both to own n others)
    users.push({ id: socket.id, name, room });
    const namesArray = users
      .filter((user) => user.room === room) // Filter users by room
      .map((user) => user.name); // Extract names from the users array
    io.to(room).emit("new-user", namesArray);
    // const numUser = io.sockets.adapter.rooms.get(data)?.size || 0
    //console.log(); gives number of users in this room
  });

  socket.on("send_message", async (data) => {
    let responseData = {};
    responseData = {
      room: data.room,
      author: data.author,
      message: data.message,
      time: data.time,
    };
    socket.to(data.room).emit("receive_message", responseData);
  });

  socket.on("leave_room", ({ room, name }) => {
    users = users.filter((user) => user.name !== name);
    const namesArray = users
      .filter((user) => user.room === room) // Filter users by room
      .map((user) => user.name);
    socket.to(room).emit("left-user", namesArray);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected id: ${socket.id}`);
    let room;
    if (users.length !== 0) {
      const disconnectedUser = users.find((user) => user.id === socket.id);
      if (disconnectedUser) {
        const removedUserIndex = users.findIndex(
          (user) => user.id === socket.id
        );
        const removedUser = users.splice(removedUserIndex, 1)[0];
        room = removedUser.room;
      }
      users = users.filter((user) => user.id !== socket.id);
      const namesArray = users
        .filter((user) => user.room === room) // Filter users by room
        .map((user) => user.name);
      socket.to(room).emit("left-user", namesArray);
    }
  });
});

server.listen(4000, () => {
  console.log(`Server is running in http://localhost:4000`);
});
