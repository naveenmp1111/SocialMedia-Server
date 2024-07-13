"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReceiverSocketId = void 0;
const userSocketMap = {};
const getReceiverSocketId = (userId) => {
    console.log('recienver and his socket id are ', userId, userSocketMap[userId]);
    return userSocketMap[userId];
};
exports.getReceiverSocketId = getReceiverSocketId;
const socketConfig = (io) => {
    io.on("connection", (socket) => {
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        console.log("A user connected", socket.id);
        const userId = socket.handshake.query.userId;
        console.log('connected user id is ', userId);
        if (userId != undefined)
            userSocketMap[userId] = socket.id;
        console.log('users online are ', userSocketMap);
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
        socket.on("disconnect", () => {
            console.log("A user disconnected", socket.id);
            delete userSocketMap[userId];
            io.emit('getOnlineUsers', Object.keys(userSocketMap));
            console.log('users online are ', userSocketMap);
        });
        socket.on("Typing", (selectedfriendId, myId) => {
            // console.log("Received message on socket is :", JSON.parse(message));
            // Broadcast the message to all connected clients
            let friendSocketId = (0, exports.getReceiverSocketId)(selectedfriendId);
            io.to(friendSocketId).emit("TypingUsers", myId);
        });
        socket.on("Stop Typing", (selectedfriendId, myId) => {
            let friendSocketId = (0, exports.getReceiverSocketId)(selectedfriendId);
            io.to(friendSocketId).emit('RemoveTypingUser', myId);
        });
        socket.on('outgoing-audio-call', (data) => {
            console.log('coming here', data);
            const friendSocketId = (0, exports.getReceiverSocketId)(data.to);
            if (friendSocketId) {
                socket.to(friendSocketId).emit('incoming-audio-call', {
                    from: data.from,
                    roomId: data.roomId,
                    callType: data.callType,
                });
            }
        });
        socket.on('outgoing-video-call', (data) => {
            const friendSocketId = (0, exports.getReceiverSocketId)(data.to);
            if (friendSocketId) {
                socket.to(friendSocketId).emit('incoming-video-call', {
                    from: data.from,
                    roomId: data.roomId,
                    callType: data.callType,
                });
            }
        });
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
        socket.on('reject-call', (data) => {
            const friendSocketId = (0, exports.getReceiverSocketId)(data.to);
            if (friendSocketId) {
                socket.to(friendSocketId).emit('call-rejected');
            }
        });
        socket.on('accept-incoming-call', (data) => {
            const friendSocketId = (0, exports.getReceiverSocketId)(data.to);
            if (friendSocketId) {
                socket.to(friendSocketId).emit('accept-call');
            }
        });
    });
};
exports.default = socketConfig;
