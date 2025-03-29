
'use client';
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import Image from "next/image";
import LoadingButton from "../Helper/LoadingButton";
import { Button } from "../ui/button";
import { ImageIcon } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { handleAuthRequest } from "../utils/apiRequest";
import { addPost } from "@/store/postSlice";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

const CreatePostModel = ({ isOpen, onClose }: Props) => {
    const router = useRouter();
    const user = useSelector((state: any) => state.auth.user); 
    const userId = user?._id;
    const dispatch = useDispatch();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [caption, setCaption] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    
    useEffect(() => {
        if (!isOpen) {
            setSelectedImage(null);
            setPreviewImage(null);
            setCaption("");
        }
    }, [isOpen]);

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];

            // Validate file type
            if (!file.type.startsWith("image/")) {
                toast.error("Please select a valid image file");
                return;
            }

            // Validate file size
            if (file.size > 10 * 1024 * 1024) {
                toast.error("File size should not exceed 10MB!");
                return;
            }

            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(file);
            setPreviewImage(imageUrl);
        }
    };

    // ✅ Function to send `FormData`
    const createPostReq = async (imageFile: File, caption: string) => {  
        try {
            const formData = new FormData();
            formData.append("image", imageFile); // 🔥 Send as `FormData`
            formData.append("caption", caption);

            const response = await axios.post(
                "http://localhost:8000/api/v1/posts/createPost",
                formData,  
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,  
                }
            );

            console.log("Post Created:", response.data);
            return response.data;
        } catch (error: any) {  
            console.error("Error creating post:", error.response?.data || error.message);
            throw error;
        }
    };

   
    const handleCreatePost = async () => {
        if (!selectedImage) {
            toast.error("Please select a picture to create a post");
            return;
        }
    
        if (!userId) {
            toast.error("User not logged in!");
            return;
        }
    
        try {
            setIsLoading(true);
    
            const result = await handleAuthRequest(() => createPostReq(selectedImage, caption), setIsLoading);
    
            //console.log("API Response:", result); // Debugging ke liye
    
            if (result && result.data) {
                const post = result.data.post || result.data.data?.post; // ✅ Ensure correct data path
                if (post) {
                    console.log("Post Created Successfully:", post);
                    dispatch(addPost(post));
                    toast.success("Post Created Successfully");
                    setPreviewImage(null);
                    setCaption("");
                    setSelectedImage(null);
                    onClose();
                    router.push("/");
                    router.refresh();
                } else {
                    console.error("Post data is missing in response:", result.data);
                    toast.error("Error: Post data is missing in API response.");
                }
            } else {
                toast.error("Something went wrong: Invalid API response.");
            }
        } catch (error) {
            console.error("Error creating post:", error);
            toast.error("Something went wrong while creating the post.");
        } finally {
            setIsLoading(false);
        }
    };
    
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
           <DialogContent className="bg-white p-6 rounded-lg shadow-lg">
    {previewImage ? (
        <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="mt-4">
                <Image
                    src={previewImage}
                    alt="Image"
                    width={400}
                    height={400}
                    className="overflow-auto max-h-96 rounded-md object-contain w-full"
                />
            </div>
            <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption"
                className="mt-4 p-2 border rounded-md w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <div className="flex space-x-4 mt-4">
                <LoadingButton
                    className="bg-blue-600 text-white hover:bg-blue-700"
                    onClick={handleCreatePost}
                    isLoading={isLoading}
                >
                    Create Post
                </LoadingButton>
                <Button
                    className="bg-gray-500 text-white hover:bg-gray-600"
                    onClick={() => {
                        setPreviewImage(null);
                        setSelectedImage(null);
                        setCaption('');
                        onClose();
                    }}
                >
                    Cancel  
                </Button>
            </div>
        </div>
    ) : (
        <>
            <DialogHeader>
                <DialogTitle className="text-center mt-3 mb-3">Upload Photo</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="flex space-x-2 text-gray-500">
                    <ImageIcon size={40} />
                </div>
                <p className="text-gray-600 mt-4">Select a photo from your device</p>
                <Button
                    className="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                    onClick={handleButtonClick}
                >
                    Select from device
                </Button>
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
            </div>
        </>
    )}
</DialogContent>

        </Dialog>
    );
};

export default CreatePostModel;
