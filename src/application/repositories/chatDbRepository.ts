import { ChatRepositoryMongoDb } from "../../frameworks/database/monogDB/repositories/chatRepositoryMongoDb";

export const chatDbRepository = (repository: ReturnType<ChatRepositoryMongoDb>) => {

    const createChat = (loggedInUserId: string, otherUserId: string) => repository.createChat(loggedInUserId, otherUserId)

    const accessChat = (loggedInUserId: string, otherUserId: string) => repository.accessChat(loggedInUserId, otherUserId)

    const getFullChat = (chatId: unknown) => repository.getFullChat(chatId as string)

    const fetchChats = (userId: string) => repository.fetchChats(userId)

    const setLatestMessage = (chatId: string, messageId: any) => repository.setLatestMessage(chatId, messageId as string)

    return {
        createChat,
        accessChat,
        getFullChat,
        fetchChats,
        setLatestMessage
    }
}

export type ChatDbRepository = typeof chatDbRepository