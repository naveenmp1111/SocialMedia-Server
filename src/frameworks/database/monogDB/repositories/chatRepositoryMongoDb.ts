import mongoose from "mongoose"
import Chat from "../models/chatModel"
import Message from "../models/messageModel"


export const chatRepositoryMongoDb = () => {

    const createChat = async (loggedInUserId: string, otherUserId: string) => {
        try {
            const newChat = new Chat({
                members: [
                    loggedInUserId,
                    otherUserId
                ]
            })
          const chat=await newChat.save()
          return chat
        
        } catch (error) {
            console.log('Erron in creating new Chat ', error)
        }
    }

    const accessChat = async (loggedInUserId: string, otherUserId: string) => {
        try {
            const loggedInUserObjectId = new mongoose.Types.ObjectId(loggedInUserId);
            const otherUserObjectId = new mongoose.Types.ObjectId(otherUserId);
    
            const chat = await Chat.findOne({
                members: {
                    $all: [loggedInUserObjectId, otherUserObjectId]
                }
            }).populate('members', '-password -savedPosts -posts -refreshToken -refreshTokenExpiresAt');
            // console.log('return from accesschat is ',chat)
            return chat;
        } catch (error) {
            console.error('Error in fetching chat', error);
            throw new Error('Error in fetching chat');
        }
    }

    const getFullChat=async(chatId:string)=>{
        try {
            const fullChat=await Chat.findById(chatId).populate("members", "-password -savedPosts -posts -refreshToken -refreshTokenExpiresAt")
            return fullChat
        } catch (error) {
            console.log('error in getting full chat',error)
        }
    }

    const fetchChats=async(userId:string)=>{
        // console.log('userid is ',userId)
        try {
            const userObjectId = new mongoose.Types.ObjectId(userId); // Convert userId to ObjectId
        const chats = await Chat.find({
            members: {$in:[userObjectId]} // Check if userObjectId exists in the members array
        }).populate('members', '-password -savedPosts -posts -refreshToken -refreshTokenExpiresAt')
          .sort({ createdAt: -1 }); // Sort by createdAt timestamp
            console.log('chats are ',chats)
            return chats
            
        } catch (error) {
            console.log('Error in fetching chats ',error)
        }
    }

    const setLatestMessage = async (chatId: string, messageId: string) => {
        try {
          // Convert strings to ObjectId
          const messageObjectId = new mongoose.Types.ObjectId(messageId);
          const chatObjectId = new mongoose.Types.ObjectId(chatId);
      
          // Find the message by ID
          const message = await Message.findById(messageObjectId);
          console.log('message is', message);
      
          // Ensure the message exists and has a message field
          if (!message || !message.message) {
            throw new Error("Message not found or message content is empty");
          }
      
          // Update the chat's latest message
          const chatData = await Chat.findByIdAndUpdate(
            chatObjectId,
            { $set: { latestMessage: message.message } },
            { new: true } // Return the updated document
          );
      
          // Ensure the chat was found and updated
          if (!chatData) {
            throw new Error("Chat not found or could not be updated");
          }
      
          console.log('updated chat data is', chatData);
      
          // Optionally return the updated chat data
          return chatData;
      
        } catch (err) {
          console.log(err);
          throw new Error("Error in setting latest message");
        }
      };
      

    return {
        createChat,
        accessChat,
        getFullChat,
        fetchChats,
        setLatestMessage
    }
}

export type ChatRepositoryMongoDb = typeof chatRepositoryMongoDb
