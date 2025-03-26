// 'use client';
// import { useRouter } from "next/navigation";
// import React, { ChangeEvent, useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
// import Image from "next/image";
// import LoadingButton from "../Helper/LoadingButton";
// import { Button } from "../ui/button";
// import { ImageIcon } from "lucide-react";
// import { toast } from "sonner";
// import axios from "axios";
// import { BASE_API_URL } from "@/server";
// import { handleAuthRequest } from "../utils/apiRequest";
// import { addPost } from "@/store/postSlice";

// type Props={
//     isOpen:boolean;
//     onClose:()=>void;
// }

// const CreatePostModel=({isOpen,onClose}:Props)=>{
//     const router=useRouter();
//     const user = useSelector((state: any) => state.auth.user); 
//     const userId = user?._id;
//     const dispatch=useDispatch();
//     const[selectedImage,setSelectedImage]=useState<File|null>(null);
//     const [previewImage,setPreviewImage]=useState<string|null>(null);
//     const[caption,setCaption]=useState<string>('');
//     const [isLoading,setIsLoading]=useState(false);
//     const fileInputRef=useRef<HTMLInputElement|null>(null);

//     useEffect(()=>{
//         if(!isOpen){
//             setSelectedImage(null);
//             setPreviewImage(null);
//             setCaption("");
//         }
//     },[isOpen]);

//     const handleButtonClick=()=>{
//         if(fileInputRef.current){
//             fileInputRef.current.click();
//         }
//     };

//     const handleFileChange=(event:ChangeEvent<HTMLInputElement>)=>{
//         if(event.target.files && event.target.files[0]){
//             const file=event.target.files[0];
//             //validate file type
//             if(!file.type.startsWith("image/")){
//                 toast.error("Please Select a valid image file");
//                 return
//             }
//             //valid file size
//             if(file.size>10*1024*1024){
//                 toast.error("File Size should not exceed 10MB!");
//             }
//             const imageUrl=URL.createObjectURL(file);
//             setSelectedImage(file);
//             setPreviewImage(imageUrl);
//         }
//     };

//     const handleCreatePost = async () => {
//         if (!selectedImage) {
//             toast.error("Please Select a Picture to create a post");
//             return;
//         }
    
//         if (!userId) {
//             toast.error("User not logged in!");
//             return;
//         }
    
//         const formData = new FormData();
//         formData.append("caption", caption);
//         formData.append("user", userId);  // ✅ Send user ID
//         formData.append("image", selectedImage); // ✅ Fix: Use selectedImage instead of imageFile
    
//         try {
//             setIsLoading(true);
           

//             const createPostReq = async (imageBase64, caption) => {
//                 try {
//                     const response = await axios.post(
//                         "http://localhost:8000/api/v1/posts/createPost",
//                         { image: imageBase64, caption: caption }, // 👈 Ensure correct keys
//                         {
//                             headers: { "Content-Type": "application/json" },
//                             withCredentials: true, // Agar auth use kar rahe ho
//                         }
//                     );
            
//                     console.log("Post Created:", response.data);
//                     return response.data;
//                 } catch (error) {
//                     console.error("Error creating post:", error.response?.data || error.message);
//                     throw error;
//                 }
//             };
            
    
//             const result = await handleAuthRequest(createPostReq, setIsLoading);
    
//             if (result) {
//                 console.log("Post Created Successfully:", result.data.data.post);
//                 dispatch(addPost(result.data.data.post));
//                 toast.success("Post Created Successfully");
//                 setPreviewImage(null);
//                 setCaption("");
//                 setSelectedImage(null);
//                 onClose();
//                 router.push("/");
//                 router.refresh();
//             }
//         } catch (error) {
//             console.error("Error creating post:", error);
//             toast.error("Something went wrong while creating the post.");
//         } finally {
//             setIsLoading(false);
//         }
//     };
    
    

// return <Dialog open={isOpen} onOpenChange={onClose}>
//     <DialogContent>
        
//         {previewImage?(
//             //Only show the selected Image
//             <div className="flex flex-col items-center justify-center text-center space-y-4">
//                 <div className="mt-4">
//                     <Image src={previewImage} alt="Image" width={400} height={400} className="overflow-auto max-h-96 rounded-md object-contain w-full"/>
//                 </div>
//                 <input type="text" value={caption} onChange={(e)=>setCaption(e.target.value)}
//                 placeholder="Write a caption" className="mt-4 p-2 borderr roundedd-md w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"/>
//                 <div className="flex space-x-4 mt-4">
//                     <LoadingButton className="bg-blue-600 text-white hover:bg-blue-700"
//                     onClick={handleCreatePost} isLoading={isLoading}>
//                         Create Post
//                     </LoadingButton>
//                     <Button className="bg-gray-500 text-white hover:bg-gray-600" onClick={()=>{
//                         setPreviewImage(null);
//                         setSelectedImage(null);
//                         setCaption('');
//                         onClose();
//                     }}>
//                       Cancel  
//                     </Button>
//                 </div>
//             </div>
//         ):(
//             //show the default
//             <>
//             <DialogHeader>
//                 <DialogTitle className="text-center mt-3 mb-3">Upload Photo</DialogTitle>
//             </DialogHeader>
//             <div className="flex flex-col items-center justify-center text-center space-y-4">
//                 <div className="flex space-x-2 text-gray-500">
//                     <ImageIcon size={40}/>
//                 </div>
//                 <p className="text-gray-600 mt-4">Select a photo from your device</p>
//                 <Button className="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer" onClick={handleButtonClick}>
//                     Select from device
//                 </Button>
//                 <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange}/>
//             </div>
//             </>
//         )}
//     </DialogContent>
// </Dialog>
// }

// export default CreatePostModel;
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
    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };
    
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
                toast.error("Please Select a valid image file");
                return;
            }

            // Validate file size
            if (file.size > 10 * 1024 * 1024) {
                toast.error("File Size should not exceed 10MB!");
                return;
            }

            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(file);
            setPreviewImage(imageUrl);
        }
    };

    const createPostReq = async (imageBase64: string, caption: string) => {  
        try {
            const response = await axios.post(
                "http://localhost:8000/api/v1/posts/createPost",
                { image: imageBase64, caption: caption },  
                {
                    headers: { "Content-Type": "application/json" },
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
            toast.error("Please Select a Picture to create a post");
            return;
        }
    
        if (!userId) {
            toast.error("User not logged in!");
            return;
        }
    
        try {
            setIsLoading(true);
    
            // 🔥 Convert Image to Base64
            const imageBase64 = await convertToBase64(selectedImage);
    
            const result = await handleAuthRequest(() => createPostReq(imageBase64, caption), setIsLoading);
    
            if (result) {
                console.log("Post Created Successfully:", result.data.data.post);
                dispatch(addPost(result.data.data.post));
                toast.success("Post Created Successfully");
                setPreviewImage(null);
                setCaption("");
                setSelectedImage(null);
                onClose();
                router.push("/");
                router.refresh();
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
            <DialogContent>
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
