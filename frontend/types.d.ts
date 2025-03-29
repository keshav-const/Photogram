export interface User{
    _id:String,
    email:String,
    password?:string,
    profilePicture?:string,
    bio?:String,
    followers:string[],
    following:string[],
    posts:Post[],
    savedPosts:string[] |Post[],
    isVerified:boolean;
    username:string;

}

export interface Comment {
    _id: string;
    text: string;
    user: {
        _id: string;
        email: string;
        username: string;
        profilePicture: string;
    };
    createdAt: string;
}


export interface Post {
    _id: string;
    caption: string;
    image?: {
        url: string;
        publicId: string;
    };
    user: {
        _id: string;
        username: string;
        email: string;
        profilePicture?: string;
    };
    likes: string[];
    comments: Array<Comment & { user: User }>; // ✅ Ensure comments include User details
    createdAt: string;
}
