import { Server } from "socket.io";

const socketConfig = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("A user connected",socket.id);

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });

    socket.on("message", (message) => {
      // console.log("Received message on socket is :", JSON.parse(message));
      // Broadcast the message to all connected clients
      io.emit("message", 'hai');
    });
  });
};

export default socketConfig;
