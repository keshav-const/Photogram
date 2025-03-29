'use client';
import { RootState } from "@/store/store";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
//import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "../ui/sheet";
import { MenuIcon } from "lucide-react";
import LeftSidebar from "@/components/Home/LeftSidebar";
import { Sheet,SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LoadingButton from "@/components/Helper/LoadingButton";
import PasswordInput from "@/components/Auth/PasswordInput";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import { handleAuthRequest } from "@/components/utils/apiRequest";
import { setAuthUser } from "@/store/authSlice";
import { toast } from "sonner";

const EditProfile=()=>{
    const dispatch=useDispatch();
    const user=useSelector((state:RootState)=>state.auth.user);
    const [selectedImage,setSelectedImage]=useState<string|null>(user?.profilePicture||null);
    const [bio,setBio]=useState<string>(user?.bio ? String(user.bio) : "");
    const[currentPassword,setCurrentPassword]=useState("");
    const[newPassword,setNewPassword]=useState("");
    const[newPasswordConfirm,setNewPasswordConfirm]=useState("");
    const fileInputRef=useRef<HTMLInputElement|null>(null);
    const [isLoading,setIsLoading]=useState(false);

    
    const handleAvatarClick=()=>{
        if(fileInputRef.current) fileInputRef.current.click();
    };




    const handleFileChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
        const file=event.target.files?.[0];
        if(file){
            const reader=new FileReader();
            reader.onload=()=>setSelectedImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfile=async()=>{
        const formData=new FormData();
        formData.append("bio",bio);
        if(fileInputRef.current?.files?.[0]){
            formData.append("profilePicture",fileInputRef.current?.files?.[0]);
        }
        const updateProfileReq=async()=> await axios.post(`${BASE_API_URL}/users/editprofile`,formData,
            {withCredentials:true});

        const result=await handleAuthRequest(updateProfileReq,setIsLoading);
        if(result){
            dispatch(setAuthUser(result.data.data.user));
            toast.success(result.data.message);
        }
        //console.log({bio});
    };

    const handlePasswordChange=async(e:React.FormEvent)=>{
        e.preventDefault();
        const data={
            currentPassword,newPassword,newPasswordConfirm
        };
        const updatePassReq=async ()=>await axios.post(`${BASE_API_URL}/users/changepassword`,data,{
            withCredentials:true,
        });
        const result =await handleAuthRequest(updatePassReq,setIsLoading);
        if(result){
            dispatch(setAuthUser(result.data.data.user));
            toast.success(result.data.message);
        }
        //console.log({currentPassword,newPassword,newPasswordConfirm});
    };
    
    return <div className="flex">
            <div className="w-[20%] hidden md:block border-r-2 h-screen fixed">
            <LeftSidebar/>
        </div>
        <div className="flex-1 md:ml-[20%] overflow-y-auto">
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger>
                        <MenuIcon/>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetTitle></SheetTitle>
                        <SheetDescription></SheetDescription>
                        <LeftSidebar/>
                    </SheetContent>
                </Sheet>
            </div>
            <div className="w-[80%] mx-auto">
                <div className="mt-16 pb-16 border-b-2">
                    <div onClick={handleAvatarClick} className="flex items-center justify-center cursor-pointer">
                        <Avatar className="w-[10rem] h-[10rem]">
                            <AvatarImage src={selectedImage||""}/>
                                <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>
                    <input type="file" accept="image" className="hidden" ref={fileInputRef} onChange={handleFileChange}/>
                    <div className="flex items-center justify-center">
                        <LoadingButton isLoading={isLoading} size={"lg"} className="bg-blue-800 mt-4 text-white on hover:bg-blue-950" onClick={handleUpdateProfile}>
                            Change Photo
                        </LoadingButton>
                    </div>
                </div>
                <div className="mt-10 border-b-2 pb-10">
                    <label htmlFor="bio" className="block text-lg font-bold mb-2">Bio</label>
                    <textarea value={bio} onChange={(e)=>setBio(e.target.value)} className="w-full h-[7rem] bg-gray-200 outline-none p-6 rounded-md"></textarea>
                    <LoadingButton isLoading={isLoading} size={"lg"} className="mt-6 text-white bg-black" onClick={handleUpdateProfile}>
                            Change Bio
                        </LoadingButton>
                </div>
                <div>
                <h1 className="text-2xl font-bol text-gray-900 mt-6">Change Password</h1>
                <form className="mt-8 mb-8" onSubmit={handlePasswordChange}>
                    <div className="w-[90%] md:[80%] lg:w-[60%]">
                        <PasswordInput name="currentpassword" value={currentPassword} label="Current Password" onChange={(e)=>setCurrentPassword(e.target.value)}/>
                    </div>
                    <div className="w-[90%] md:[80%] lg:w-[60%] mt-4 mb-4">
                        <PasswordInput name="newpassword" value={newPassword} label="New Password" onChange={(e)=>setNewPassword(e.target.value)}/>
                    </div>
                    <div className="w-[90%] md:[80%] lg:w-[60%]">
                        <PasswordInput name="newpasswordconfirm" value={newPasswordConfirm} label="Confirm New Password" onChange={(e)=>setNewPasswordConfirm(e.target.value)}/>
                    </div>
                    <div className="mt-6 ">
                        <LoadingButton isLoading={isLoading} type="submit" className="bg-red-700 text-white">
                            Change Password
                        </LoadingButton>
                    </div>
                </form>
                </div>
            </div>
        </div>
        </div>
    
}
export default EditProfile;