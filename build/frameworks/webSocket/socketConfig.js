"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socketConfig = (io) => {
    io.on("connection", (socket) => {
        console.log("A user connected", socket.id);
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
exports.default = socketConfig;
