// "use client";

// import { RootState } from '@/store/store';
// import React from 'react';
// import { useSelector } from 'react-redux';
// const Home=()=>{
//    const user=useSelector((state:RootState)=>state?.auth.user);
//    console.log(user);
//    return <div>
//     Home
//    </div> 
// };
// export default Home;
// "use client";
// import { RootState } from "@/store/store";
// import { useSelector } from "react-redux";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

// const Home = () => {
//    const user = useSelector((state: RootState) => state.auth.user);
//    const router = useRouter();

//    useEffect(() => {
//        if (!user) {
//            console.log("No user found, redirecting to signup.");
//            router.push("/auth/signup");
//        } else {
//            console.log("User found:", user);
//        }
//    }, [user, router]);

//    return <div>Home</div>;
// };
// export default Home;
"use client";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import LeftSidebar from "./LeftSidebar";
import Feed from "./Feed";
import RightSidebar from "./RightSidebar";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "../ui/sheet";
import { MenuIcon } from "lucide-react";

const Home = () => {
//    const user = useSelector((state: RootState) => state.auth.user);
//    const router = useRouter();

//    useEffect(() => {
//        if (!user) {
//            console.log("No user found, redirecting to signup.");
//            router.push("/auth/signup"); // ✅ User nahi hai to signup pe bhejo
//        } else {
//            console.log("User found:", user);
//            router.push("/"); // ✅ User hai to homepage pe bhejo
//        }
//    }, [user, router]);

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
            <Feed/>
        </div>
        <div className="w-[30%] pt-8 px-6 lg:block hidden">
            <RightSidebar/>
        </div>
   </div>;
};
export default Home;
