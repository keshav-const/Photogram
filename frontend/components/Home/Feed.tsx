
"use client";

import { BASE_API_URL } from "@/server";
import { RootState } from "@/store/store";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleAuthRequest } from "../utils/apiRequest";
import { addComment, likeorDislike, setPost } from "@/store/postSlice";
import { Bookmark, HeartIcon, Loader, MessageCircle, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import DotButton from "../Helper/DotButton";
import Image from "next/image";
import Comment from "../Helper/Comment";
import { toast } from "sonner";
import { setAuthUser } from "@/store/authSlice";
import { Post } from "@/types";

const Feed = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const posts = useSelector((state: RootState) => state.posts.posts);
    const [comment, setComment] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getAllPost = async () => {
            try {
                const getAllPostReq = async () => await axios.get(`${BASE_API_URL}/posts/all`);
                const result = await handleAuthRequest(getAllPostReq, setIsLoading);

                if (result) {
                    dispatch(setPost(result.data.data.posts));
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        getAllPost();
    }, [dispatch]);

    const handleLikeDislike = async (id: string) => {
        try {
            const result = await axios.post(`${BASE_API_URL}/posts/likeunlike/${id}`, {}, { withCredentials: true });

            if (result.data.status === "success") {
                if (user?._id) {
                    dispatch(likeorDislike({ postId: id, userId: String(user?._id) }));
                    toast.success(result.data.message);
                }
            }
        } catch (error) {
            console.error("Error liking post:", error);
            toast.error("Failed to like/dislike post.");
        }
    };


    const handleSaveUnsave = async (id: string) => {
        try {
            const result = await axios.post(`${BASE_API_URL}/posts/saveunsavepost/${id}`, {}, { withCredentials: true });
    
            console.log("API Response:", result.data); // Debugging
    
            if (result.data.status === "success") {
                const updatedUser = result.data?.data?.user;
    
                if (updatedUser) {
                    dispatch(setAuthUser(updatedUser)); // Update Redux
                    toast.success(result.data.message);
                } else {
                    console.warn("Warning: `user` data missing in API response.");
                    toast.success(result.data.message);
                }
            }
    
            // ✅ Manually update UI by toggling saved state
            if (user) {
                const isSaved = user.savedPosts.some((postId: any) => String(postId) === id);
                const updatedSavedPosts: string[] = isSaved
                    ? user.savedPosts.filter((postId): postId is string => typeof postId === "string" && postId !== id) // Remove post
                    : [...user.savedPosts.filter((postId): postId is string => typeof postId === "string"), id]; // Add post
    
                dispatch(setAuthUser({ ...user, savedPosts: updatedSavedPosts }));
            }
        } catch (error) {
            console.error("Error saving post:", error);
            toast.error("Failed to save post.");
        }
    };
    

    const handleComment = async (id: string) => {
        //console.log(`Commenting on post: ${id}`);
        if(!comment) return;
        const addCommentReq=async ()=> axios.post(`${BASE_API_URL}/posts/comment/${id}`,{text:comment},
            {withCredentials:true}
        );
        const result=await handleAuthRequest(addCommentReq);
        if(result?.data.status=='success'){
            dispatch(addComment({postId:id,comment:result?.data.data.comment}));
            toast.success('Comment Posted');
            setComment("");
        }
    };

    if (isLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center flex-col">
                <Loader className="animate-spin" />
            </div>
        );
    }

    if (posts.length < 1) {
        return <div className="text-3xl m-8 text-center capitalize font-bold">No Post to Show</div>;
    }

    return (
        <div className="mt-20 w-[70%] mx-auto">
            {posts.map((post) => (
                <div key={post._id} className="mt-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Avatar className="w-9 h-9">
                                <AvatarImage src={post.user?.profilePicture || "/default-avatar.png"} className="h-full w-full" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <h1>{post.user?.username || "Unknown User"}</h1>
                        </div>
                        <DotButton post={post} user={user} />
                    </div>

                    <div className="mt-2">
                        <Image src={`${post.image?.url}`} alt="Post" width={400} height={400} className="w-full" />
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <HeartIcon onClick={() => handleLikeDislike(post._id)} className={`cursor-pointer ${user?._id && post.likes.includes(String(user._id)) ? "text-red-500" : ""}`} />
                            <MessageCircle className="cursor-pointer" />
                            <Send className="cursor-pointer" />
                        </div>
                        {/* <Bookmark
                            onClick={() => handleSaveUnsave(post._id)}
                            className={`cursor-pointer ${(user?.savedPosts || []).some((savePostId) => savePostId === post._id) ? "text-red-500" : ""}`}
                        /> */}
                        <Bookmark
                         onClick={() => handleSaveUnsave(post._id)}
                        className={`cursor-pointer ${
                        user?.savedPosts?.filter((savedPost): savedPost is Post => typeof savedPost !== "string")
                        .some((savedPost) => savedPost._id === post._id) ? "text-red-500" : "text-gray-500"
                    }`}
                        />

                    </div>

                    <h1 className="mt-2 text-sm font-semibold">{post.likes.length} likes</h1>
                    <p className="mt-2 font-medium">{post.caption}</p>

                    <Comment post={post} user={user} />

                    <div className="mt-2 flex items-center">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            className="flex-1 placeholder:text-gray-800 outline:none"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <p role="button" className="text-sm font-semibold text-blue-700 cursor-pointer" onClick={() => {handleComment(post._id)}}>
                            Post
                        </p>
                    </div>

                    <div className="pb-6 border-b-2"></div>
                </div>
            ))}
        </div>
    );
};

export default Feed;
