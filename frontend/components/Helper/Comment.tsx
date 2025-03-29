"use client";
import { Post, User, Comment as CommentType } from "@/types";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import DotButton from "./DotButton";
import { Button } from "../ui/button";
import { handleAuthRequest } from "../utils/apiRequest";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import { toast } from "sonner";
import { addComment } from "@/store/postSlice";
// import Post from "../Profile/Post";

type Props = {
    user: User | null;
    post: Post | null;
};

const Comment = ({ post, user }: Props & { post: Post & { comments: (CommentType & { user: User & { username: string } })[] } }) => {
    const [comment, setComment] = useState("");
    const dispatch = useDispatch();
    const addCommentHandler = async (id: string) => {
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

    return (
        <div className="cursor-pointer">
            <Dialog>
                <DialogTrigger>
                    <p className="mt-2 text-sm font-semibold">
                        View All {post?.comments.length} Comments
                    </p>
                </DialogTrigger>

                {/* MODAL CONTENT */}
                <DialogContent 
                    className="max-w-[90vw] w-[80vw] h-[70vh] p-0 flex bg-white rounded-lg shadow-lg"
                >
                    <DialogTitle></DialogTitle>

                    <div className="flex flex-1">
                        {/* LEFT SIDE IMAGE */}
                        <div className="w-1/2 h-full hidden sm:block">
                            <Image 
                                src={`${post?.image?.url}`} 
                                alt="Post Image" 
                                width={700} 
                                height={700} 
                                className="w-full h-full object-cover rounded-l-lg"
                            />
                        </div>

                        {/* RIGHT SIDE CONTENT */}
                        <div className="w-1/2 flex flex-col mt-4">
                            {/* HEADER - USERNAME + DOT BUTTON */}
                            <div className="flex items-center justify-between p-4 border-b">
                                <div className="flex gap-3 items-center">
                                    <Avatar>
                                        <AvatarImage src={post?.user?.profilePicture}/>
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <p className="font-semibold text-sm">{post?.user?.username}</p>
                                </div>
                                <DotButton user={user} post={post}/>
                            </div>

                            {/* COMMENTS SECTION */}
                            <div className="flex-1 overflow-y-auto p-4">
                                {post?.comments.map((item) => (
                                    <div key={item._id} className="flex mb-4 gap-3 items-center">
                                        <Avatar>
                                            <AvatarImage src={item?.user?.profilePicture}/>
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <div className="flex items-center space-x-2">
                                            <p className="text-sm font-bold">{item?.user?.username}</p>
                                            <p className="font-normal text-sm">{item?.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* COMMENT INPUT FIELD */}
                            <div className="p-4 border-t">
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="text" 
                                        value={comment} 
                                        onChange={(e) => setComment(e.target.value)} 
                                        placeholder="Add a comment..." 
                                        className="w-full outline-none border text-sm border-gray-300 p-2 rounded"
                                    />
                                    <Button onClick={()=>{
                                        if(post?._id) addCommentHandler(post?._id);
                                    }} variant={"outline"}>Send</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Comment;
