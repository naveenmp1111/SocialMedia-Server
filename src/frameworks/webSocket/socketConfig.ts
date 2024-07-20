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

    socket.on("Typing", (selectedfriendId,myId) => {
      // console.log("Received message on socket is :", JSON.parse(message));
      // Broadcast the message to all connected clients
      let friendSocketId=getReceiverSocketId(selectedfriendId)
      io.to(friendSocketId).emit("TypingUsers",myId);
    });

    socket.on("Stop Typing",(selectedfriendId,myId)=>{
      let friendSocketId=getReceiverSocketId(selectedfriendId)
      io.to(friendSocketId).emit('RemoveTypingUser',myId)
    })

    socket.on('outgoing-audio-call',(data)=>{
      // console.log('coming here',data)
      const friendSocketId=getReceiverSocketId(data.to)
      if(friendSocketId){
        socket.to(friendSocketId).emit('incoming-audio-call',{
          from:data.from,
          roomId:data.roomId,
          callType:data.callType,
        })
      }
    })

    socket.on('outgoing-video-call',(data)=>{
      const friendSocketId=getReceiverSocketId(data.to)
      if(friendSocketId){
        socket.to(friendSocketId).emit('incoming-video-call',{
          from:data.from,
          roomId:data.roomId,
          callType:data.callType,
        })
      }
    })

    // socket.on('reject-audio-call',(data)=>{
    //   const friendSocketId=getReceiverSocketId(data.to)
    //   if(friendSocketId){
    //     socket.to(friendSocketId).emit('call-rejected')
    //   }
    // })

    // socket.on('reject-video-call',(data)=>{
    //   const friendSocketId=getReceiverSocketId(data.to)
    //   if(friendSocketId){
    //     socket.to(friendSocketId).emit('call-rejected')
    //   }
    // })

    socket.on('leave-room', (data) => {
      // console.log('coming here')
      const friendSocketId=getReceiverSocketId(data.to)
      if(friendSocketId){
        // console.log('coming here')
        socket.to(friendSocketId).emit('user-left');
      }
  });

    socket.on('reject-call',(data)=>{
      // console.log('data coming through reject call is ',data)
        const friendSocketId=getReceiverSocketId(data.to)
        if(friendSocketId){
          socket.to(friendSocketId).emit('call-rejected')
        }
      })

    socket.on('accept-incoming-call',(data)=>{
      const friendSocketId=getReceiverSocketId(data.to)
      if(friendSocketId){
        socket.to(friendSocketId).emit('accept-call',(data))
      }
    })
    

  });
};

export default socketConfig;
