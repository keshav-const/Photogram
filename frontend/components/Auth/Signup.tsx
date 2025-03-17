import React from "react";
import Image from "next/image";
import PasswordInput from "./PasswordInput";
import LoadingButton from "../Helper/LoadingButton";

const Signup=()=>{
    return <div className="w-full h-screen overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
            {/*Banner*/}
            <div className="lg:col-span-4 h-screen hidden lg:block">
                <Image src="/images/banner.png" alt="Sign Up Banner" width={1000} height={1000} 
                className="w-full h-full object-cover"/>
            </div> 
            {/*Form*/}
            <div className="lg:col-span-3 flex flex-col items-center justify-center h-screen">
                <h1 className="font-bold text-xl sm:text-2xl text-left uppercase mb-8">
                    Sign UP with <span className="text-rose-800">PhotoGram</span> </h1>
                    <form className="block w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
                        <div className="mb-4">
                            <label htmlFor="name" className="font-semibold mb-2 block">Username</label>
                            <input type="text" name="username" placeholder="Username" className="px-4 py-3 bg-gray-200 rounded-lg w-full block outline-none" />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="font-semibold mb-2 block">Email</label>
                            <input type="email" name="Email" placeholder="Email id" className="px-4 py-3 bg-gray-200 rounded-lg w-full block outline-none" />
                        </div>
                        <div className="mb-4">
                            <PasswordInput label="Password" name="password" placeholder="Enter Password"/>
                        </div>
                        <div className="mb-4">
                            <PasswordInput name="passwordConfirm" label="Confirm Password" placeholder="Confirm Password"/>

                        </div>
                        <LoadingButton size={"lg"} className="w-full mt-3"type="submit" />
                    </form>
            </div>
        </div>
    
    </div>
}
export default Signup;
