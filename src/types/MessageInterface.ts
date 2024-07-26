export interface MessageInterface {
    senderId: string,
    message: string,
    chatId: string,
    isSeen?: boolean
    // image?: string,
}