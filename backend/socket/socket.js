const { Server } = require("socket.io");

const setupSocketIO = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  const users = new Map(); 

  io.on("connection", (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    socket.on("register", (username) => {
      if (username) {
        users.set(username, socket.id);
        socket.username = username;
        console.log(`👤 User registered: ${username} (${socket.id})`);
        io.emit("user-list", Array.from(users.keys()));
      }
    });

    socket.on("get-user-list", () => {
      socket.emit("user-list", Array.from(users.keys()));
    });

    socket.on("send-file", ({ recipient, fileName, fileBuffer }) => {
      const recipientSocketId = users.get(recipient);

      if (recipientSocketId) {
        console.log(`Sending file ${fileName} to ${recipient}`);
        io.to(recipientSocketId).emit("receive-file", {
          sender: socket.username,
          fileName,
          fileBuffer,
        });
      } else {
        console.log(`Recipient ${recipient} not found or not online.`);
        // Optionally, emit an error back to the sender
        socket.emit("transfer-error", `User ${recipient} is not online.`);
      }
    });

    socket.on("disconnect", () => {
      if (socket.username) {
        users.delete(socket.username);
        console.log(`🔌 User disconnected: ${socket.username}`);
        io.emit("user-list", Array.from(users.keys()));
      }
    });
  });

  return io;
};

module.exports = setupSocketIO;
