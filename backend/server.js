const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const port = 5000;
const UserRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const path = require("path");

const { notFound, errorHandler } = require("./Middlewares/errorMiddleware");

dotenv.config();
connectDB();
const app = express();

app.use(express.json());

app.get("/api/chats", (req, res) => {
  res.send(chats);
});

app.use("/api/user", UserRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

//------------------------Deployment------------------//

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/chatbird/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "chatbird", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => res.send("API is running successfully "));
}

//------------------------Deployment------------------//
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(port, () => console.log(`Listening on port ${port}`));

const io = require("socket.io")(server, {
  pingTimeout: 80000,
  cors: {
    origin: "https://chat-bird.onrender.com",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);

    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("user disconnected");
    socket.leave(userData._id);
  });
});
