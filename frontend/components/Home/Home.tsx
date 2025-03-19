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

const Home = () => {
   const user = useSelector((state: RootState) => state.auth.user);
   const router = useRouter();

   useEffect(() => {
       if (!user) {
           console.log("No user found, redirecting to signup.");
           router.push("/auth/signup"); // ✅ User nahi hai to signup pe bhejo
       } else {
           console.log("User found:", user);
           router.push("/"); // ✅ User hai to homepage pe bhejo
       }
   }, [user, router]);

   return <div>Home</div>;
};
export default Home;
