import { Server } from "socket.io";

const userSocketMap: { [key: string]: string } = {};

export const getReceiverSocketId=(userId:string)=>{
  console.log('recienver and his socket id are ',userId, userSocketMap[userId])
  return userSocketMap[userId]
}

const socketConfig = (io: Server) => {

  io.on("connection", (socket) => {
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    console.log("A user connected",socket.id);
    const userId=socket.handshake.query.userId
    console.log('connected user id is ',userId)
    if(userId!=undefined) userSocketMap[userId as string]=socket.id
    console.log('users online are ',userSocketMap)
    io.emit('getOnlineUsers',Object.keys(userSocketMap))

    socket.on("disconnect", () => {
      console.log("A user disconnected",socket.id);
      delete userSocketMap[userId as string]
      io.emit('getOnlineUsers',Object.keys(userSocketMap))
      console.log('users online are ',userSocketMap)
      
    });

    // socket.on("message", (message) => {
      // console.log("Received message on socket is :", JSON.parse(message));
      // Broadcast the message to all connected clients
      // io.emit("message", 'hai');
    // });
  });
};

export default socketConfig;
