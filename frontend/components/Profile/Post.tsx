import { User } from "@/types";
import React from "react";
type Props={
    userProfile:User|undefined;
}
const Post=({userProfile}:Props)=>{
    return (
        <div>
            Post
        </div>
    )
}
export default Post;