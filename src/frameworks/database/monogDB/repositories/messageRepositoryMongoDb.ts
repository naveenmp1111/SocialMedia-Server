import mongoose from "mongoose"
import { MessageInterface } from "../../../../types/MessageInterface"
import Message from "../models/messageModel"
import { getReceiverSocketId } from "../../../webSocket/socketConfig"
import { io } from "../../../../app"
import Chat from "../models/chatModel"


export const messageRepositoryMongoDb = () => {

  const sendMessage = async (newMessage: MessageInterface) => {
    try {
      const message = await Message.create(newMessage)
      // console.log('new message created is ',message)
      return message
    } catch (error) {
      console.log('error in creating new message ', error)
    }
  }

  const getFullMessage = async (messageId: string) => {
    try {
      const messageIdObject = new mongoose.Types.ObjectId(messageId);
      const fullMessage = await Message.findById(messageIdObject)
        .populate(
          "senderId",
          "-password -savedPosts -posts -refreshToken -refreshTokenExpiresAt -followers -following"
        )
        .populate("chatId")
        .populate(
          "chatId.members",
          "-password -savedPosts -posts -refreshToken -refreshTokenExpiresAt -followers -following"
        );
      // console.log('full message is ',fullMessage)
      //@ts-ignore
      // console.log('members in messageData is ',fullMessage?.chatId?.members)
      const recieverId = fullMessage?.chatId?.members?.find(item => item.toString() !== fullMessage.senderId._id.toString());

      // console.log('recieverid is ',recieverId)
      const receiverSocketId = getReceiverSocketId(recieverId)
      if (receiverSocketId) {
        console.log('Ready to emit event to ', receiverSocketId)
        io.to(receiverSocketId).emit('newMessage', fullMessage)
      }
      return fullMessage

    } catch (error) {
      console.log('error in getting full message', error)
    }
  }

  const getAllMessagesFromChat = async (chatId: string, userId: string) => {
    try {
      let chatIdObj = new mongoose.Types.ObjectId(chatId)
      const messages = await Message.find(
        {
          chatId: chatIdObj,
          isDeleted: { $ne: true },
          deletedBy: { $ne: userId }
        })
        .populate(
          "senderId",
          "-password -savedPosts -posts -refreshToken -refreshTokenExpiresAt -followers -following"
        )
        .populate("chatId")

      return messages;
    } catch (err) {
      console.log(err);
      throw new Error("Error in getting messages");
    }
  };

  const getUnreadMessagesFromChat = async (chatId: string, userId: string) => {
    try {
      let chatIdObj = new mongoose.Types.ObjectId(chatId)
      const messages = await Message.find({ chatId: chatIdObj, isSeen: false, senderId: { $ne: userId } })
        .populate(
          "senderId",
          "-password -savedPosts -posts -refreshToken -refreshTokenExpiresAt -followers -following"
        )
        .populate("chatId")

      return messages;
    } catch (error) {
      console.log(error)
      throw new Error('Error in getting all unread messages')
    }
  }

  const getAllUnreadMessages = async (userId: string) => {
    try {
      const chatIds = await Chat.find(
        { members: { $in: [userId] } },
        { _id: 1 } // Include chatId and exclude _id
      );

      // Extract chatId values from the array of objects
      //@ts-ignore
      const chatIdArray = chatIds.map((chat) => chat?._id);
      // console.log('array of chat id is ',chatIdArray)

      // // Use the extracted chatId values in the Message.find query
      const messages = await Message.find({ chatId: { $in: chatIdArray }, senderId: { $ne: userId }, isSeen: false });

      // console.log('Unread messages are ',messages)
      return messages

    } catch (error) {
      console.log(error)
      throw new Error('Error in getting all unread messages')
    }
  }

  const setUnreadMessagesRead = async (chatId: string, userId: string) => {
    try {
      let chatIdObj = new mongoose.Types.ObjectId(chatId)
      await Message.updateMany({ chatId: chatIdObj, isSeen: false, senderId: { $ne: userId } }, { isSeen: true })
    } catch (error) {
      console.log(error)
      throw new Error('Error in setting unread messages read.')
    }
  }

  const deleteMessage = async (messageId: string) => {
    try {
      let messageIdObj = new mongoose.Types.ObjectId(messageId)
      const messageData = await Message.findByIdAndUpdate(messageIdObj, { isDeleted: true }).populate('chatId')
      //@ts-ignore
      const recieverId = messageData?.chatId?.members?.find(item => item.toString() !== messageData?.senderId._id.toString());
      const receiverSocketId = getReceiverSocketId(recieverId)
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('deleteMessage', messageId)
      }
      const lastMessage = await Message.find({ chatId: messageData?.chatId, isDeleted: false }).sort({ createdAt: -1 }).limit(1)
      return lastMessage
      //   console.log('latestmessage inside chat is',lastMessage)
      //   //@ts-ignore  
      //   let chatIdObj=new mongoose.Types.ObjectId(messageData?.chatId as string)
      //   //@ts-ignore

      //  const updatedChat = await Chat.findByIdAndUpdate(chatIdObj,{latestMessage:lastMessage.message},{new:true})
      //  console.log('updated chat is ',updatedChat)
    } catch (error) {
      console.log('error in deleting message', error)
      throw new Error('Error in deleting message')
    }
  }

  const deleteMessageForMe = async (messageId: string, userId: string) => {
    try {
      let messageIdObj = new mongoose.Types.ObjectId(messageId)
      return await Message.findByIdAndUpdate(messageIdObj, { $addToSet: { deletedBy: userId } })
    } catch (error) {
      console.log('error is ', error)
      throw new Error('Error in deleting message for me')
    }
  }

  return {
    sendMessage,
    getAllMessagesFromChat,
    getFullMessage,
    getUnreadMessagesFromChat,
    setUnreadMessagesRead,
    deleteMessage,
    deleteMessageForMe,
    getAllUnreadMessages
  }

}

export type MessageRepositoryMongoDb = typeof messageRepositoryMongoDb