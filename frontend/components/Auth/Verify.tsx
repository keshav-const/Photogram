// "use client";
// import { MailCheck } from 'lucide-react';
// import React, { ChangeEvent,KeyboardEvent,useRef,useState } from 'react';
// import LoadingButton from '../Helper/LoadingButton';

// const Verify=()=>{
//     const[isLoading,setIsLoading]=useState(false);
//     const [otp,setotp]=useState<string[]>(['','','','','','']);
//     const inputrefs=useRef<Array<HTMLInputElement|null>>([]);
//     console.log(otp);
//     const handleChange=(index:number,event:ChangeEvent<HTMLInputElement>):void=>{
//         const{value}=event.target;
//         if(/^\d*$/.test(value) && value.length<=1){
//             const newOtp=[...otp];
//             newOtp[index]=value;
//             setotp(newOtp);
//         }
//         if(value.length===1 && inputrefs.current[index+1]){
//             inputrefs.current[index+1]?.focus();
//         }
//     };
//     const handleKeyDown=(index:number,event:KeyboardEvent<HTMLInputElement>):void=>{
//         if(event.key==='Backspace' && !inputrefs.current[index]?.value && inputrefs.current[index-1]){
//             inputrefs.current[index-1]?.focus();
//         }
//         }
    

//     return <div className="h-screen flex items-center flex-col justify-center">
//         <MailCheck className="w-20 h-20 sm:w-32 sm:h-32 text-red-600 mb-12"/>
//         <h1 className='text-2xl sm:text-3xl font-bold mb-3'>
//            OTP Verification 
//         </h1>
//         <p className="mb-6 text-sm sm:text-base text-gray-600 font-medium">We have Sent OTP to @gmail.com</p>
//         <div className="flex space-x-4">
//             {[0,1,2,3,4,5].map((index)=>{
//                 return(
//                     <input type="number" key={index} maxLength={1} className="sm:w-20 sm:h-20 w-10 h-10 rounded-lg bg-gray-200 text-lg sm:text-3xl font-bold outline-gray-500 text-center no-spinner"
//                     value={otp[index]||""} ref={(el)=>{inputrefs.current[index]=el;}} onKeyDown={(e)=>handleKeyDown(index,e)}
//                     onChange={(e)=>handleChange(index,e)}/>
//                 );
//             })}
//         </div>
//         <div className="flex items-center mt-4 space-x-2">
//                 <h1 className="text-sm sm:text-lg font-medium text-gray-700">
//                     Didn't recive OTP?
//                 </h1>
//                 <button className='text-sm sm:text-lg text-blue-900 underline'>
//                    Resend Code 
//                 </button>
//         </div>
//         <LoadingButton isLoading={isLoading} size={"lg"} className="mt-6 w-52  bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-lg">
//             Verify
//         </LoadingButton>
//     </div>
// };
// export default Verify;


"use client";
import { Loader, MailCheck } from "lucide-react";
import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import LoadingButton from "../Helper/LoadingButton";
import { BASE_API_URL } from "@/server";
import axios from "axios";
import { handleAuthRequest } from "../utils/apiRequest";
import { useDispatch, useSelector } from "react-redux";

import { setAuthUser } from "@/store/authSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { RootState } from "@/store/store";

const Verify = () => {
    const dispatch=useDispatch();
    const user=useSelector((state:RootState)=>state?.auth.user);
    const router=useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const[isPageLoading,setisPageLoading]=useState(true);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  useEffect(()=>{
    if(!user){
        router.replace("/auth/login");
    }else if(user && user.isVerified){
        router.replace("/");
    }else{
        setisPageLoading(false);
    }
  },[user,router]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>(new Array(6).fill(null));

  console.log(otp);

  const handleChange = (index: number, event: ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }

    if (value.length === 1 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
{

}
  const handleSubmit=async()=>{
    const otpValue=otp.join("");
    const verifyReq=async()=>await axios.post(`${BASE_API_URL}/users/verify`,{otp:otpValue},
        {withCredentials:true}
    );
    const result=await handleAuthRequest(verifyReq,setIsLoading);
    if(result){
        dispatch(setAuthUser(result.data.data.user));
        toast.success(result.data.message);
        router.push("/");
    }

  };
  const handleResendOtp=async()=>{
    const resendOtpReq=async()=>
        await axios.post(`${BASE_API_URL}/users/resend-otp`,null,{
            withCredentials:true,
        });
        const result=await handleAuthRequest(resendOtpReq,setIsLoading);
        if(result){
            toast.success(result.data.message);
        }
  };

  if(isPageLoading){
    return (
        <div className="h-screen flex justify-center items-center">
            <Loader className="w-20 animate-spin"/>
        </div>
    )
  }



  return (
    <div className="h-screen flex items-center flex-col justify-center">
      <MailCheck className="w-20 h-20 sm:w-32 sm:h-32 text-red-600 mb-12" />
      <h1 className="text-2xl sm:text-3xl font-bold mb-3">OTP Verification</h1>
      <p className="mb-6 text-sm sm:text-base text-gray-600 font-medium">
        We have Sent OTP to {user?.email}
      </p>
      <div className="flex space-x-4">
        {otp.map((_, index) => (
          <input
            type="number"
            key={index}
            maxLength={1}
            className="sm:w-20 sm:h-20 w-10 h-10 rounded-lg bg-gray-200 text-lg sm:text-3xl font-bold outline-gray-500 text-center no-spinner"
            value={otp[index] || ""}
            ref={(el) => {
              if (el) inputRefs.current[index] = el;
            }}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onChange={(e) => handleChange(index, e)}
          />
        ))}
      </div>
      <div className="flex items-center mt-4 space-x-2">
        <h1 className="text-sm sm:text-lg font-medium text-gray-700">
          Didn't receive OTP?
        </h1>
        <button onClick={handleResendOtp}className="text-sm sm:text-lg text-blue-900 underline">Resend Code</button>
      </div>
      <LoadingButton
      onClick={handleSubmit}
        isLoading={isLoading}
        size={"lg"}
        className="mt-6 w-52 bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-lg"
      >
        Verify
      </LoadingButton>
    </div>
  );
};

export default Verify;
