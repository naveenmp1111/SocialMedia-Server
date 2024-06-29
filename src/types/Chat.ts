import { UserDataInterface } from "./LoginUserInterface";

export interface fetchChatsResponse{
    message:string,
    status:string,
    chats:UserDataInterface[]
}

