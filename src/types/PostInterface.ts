export interface PostDataInterface{
    userId: string;
    description?: string;
    // hashtags?: string;
    // hashtagsArray?: string[];
    // likes?: string[];
    // comments?: string[];
    // saved?: string[];
    // reports: string[];
    // video?: string;
    taggedUsers?:string[]
    image?: string[];
    isBlock: boolean;
}