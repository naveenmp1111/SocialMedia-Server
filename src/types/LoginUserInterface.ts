export interface UserInterface {
    _id?: string;
    name: string;
    username: string;
    email: string;
    password: string;
    phoneNumber?: number;
}

export interface GoogleUserInterface {
    name: string,
    username?: string,
    email: string,
    phoneNumber?: number,
    password?: string,
}

export interface UserDataInterface {
    _id?: string;
    name: string;
    username?: string;
    email: string;
    phoneNumber?: number;
    dp?: string;
    coverPhoto?: string;
    bio?: string;
    gender?: string;
    city?: string;
    followers?: string[];
    following?: string[];
    savedPosts?: string[];
    isAccountVerified: boolean;
    isGoogleSignIn: boolean;
    isBlock: boolean;
    createdAt?: string;
}