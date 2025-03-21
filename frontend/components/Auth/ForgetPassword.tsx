"use client";
import { KeySquareIcon } from "lucide-react";
import React, { useState } from "react";
import LoadingButton from "../Helper/LoadingButton";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import { handleAuthRequest } from "../utils/apiRequest";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


const Forgetpassword=()=>{
    const [isLoading,setIsLoading]=useState(false);
    const[email,setEmail]=useState("");
    const router=useRouter();
    const handleSubmit=async()=>{
        const forgetPassReq=async()=> await axios.post(`${BASE_API_URL}/users/forgetpassword`,{email},
            {withCredentials:true}
        );
        const result =await handleAuthRequest(forgetPassReq,setIsLoading);
        if(result){
            router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`)
            toast.success(result.data.message);
        }
    };

    return <div className="flex items-center justify-center flex-col w-full h-screen ">
        <KeySquareIcon className="w-20 h-20 sm:w-32 text-red-600 mb-12"/>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">
            Forget Your Paassword?
        </h1>
        <p className="mb-6 text-sm sm:text-base text-center text-gray-600 font-medium">
          Enter your email to reset your Password  
        </p>
        <input type="email" placeholder="Enter Your Email id" className="px-6 py-3.5 rounded-lg outline-none bg-gray-200 block w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] mx-auto"
        value={email} onChange={(e)=>setEmail(e.target.value)}/>
        <LoadingButton onClick={handleSubmit} className="mt-3 bg-black hover:bg-black text-white px-6 py-3 rounded-lg" size={"lg"} isLoading={isLoading}>
            Continue
        </LoadingButton>
    </div>
}
export default Forgetpassword;