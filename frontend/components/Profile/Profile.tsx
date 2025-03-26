// "use client";
// import { BASE_API_URL } from "@/server";
// import { RootState } from "@/store/store";
// import { User } from "@/types";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { handleAuthRequest } from "../utils/apiRequest";
// import { Loader } from "lucide-react";
// import LeftSidebar from "../Home/LeftSidebar";
// import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "../ui/sheet";
// import { MenuIcon } from "lucide-react";
// type Props={id:string};
// const Profile=({id}:Props)=>{
//     const router=useRouter();
//     const user=useSelector((state:RootState)=>state.auth.user);
//     console.log("Redux User State:", user);
//     const [postorSave,setPostorSave]=useState<string>("POST");
//     const [isLoading,setIsLoading]=useState(false);
//     const [userProfile,setUserProfile]=useState<User>();
//     const isOwnProfile=user?._id===id;
//     const isFollowing=user?.following.includes(id);

//     console.log("user",userProfile);
//     console.log("isOWNPROFILE",isOwnProfile);
//     useEffect(()=>{
//         if(!user){
//             return router.push("/auth/login");
//         }
//         const getUser=async()=>{
//             const getUserreq=async()=> await axios.get(`${BASE_API_URL}/users/profile/${id}`);
//             const result=await handleAuthRequest(getUserreq,setIsLoading);
//             if(result){
//                 setUserProfile(result?.data.data.user);
//             }
//         };
//         getUser();
        
//     },[user,router,id]);
//     if(isLoading){
//         return (
//             <div className="w-full h-screen flex items-center justify-center flex-col">
//                 <Loader className="animate-spin"/>
//             </div>
//         )
//     }
//     return <div  className="flex mb-20">
//         <div className="w-[20%] hidden md:block border-r-2 h-screen fixed">
//             <LeftSidebar/>
//         </div>
//         <div className="flex-1 md:ml-[20%] overflow-y-auto">
//         <div className="md:hidden">
//                 <Sheet>
//                     <SheetTrigger>
//                         <MenuIcon/>
//                     </SheetTrigger>
//                     <SheetContent>
//                         <SheetTitle></SheetTitle>
//                         <SheetDescription></SheetDescription>
//                         <LeftSidebar/>
//                     </SheetContent>
//                 </Sheet>
//             </div>
//         </div>
    
//     </div>
// }
// export default Profile;
// "use client";
// import { BASE_API_URL } from "@/server";
// import { RootState } from "@/store/store";
// import { User } from "@/types";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { handleAuthRequest } from "../utils/apiRequest";
// import { Loader } from "lucide-react";
// import LeftSidebar from "../Home/LeftSidebar";
// import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
// import { MenuIcon } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
// import Link from "next/link";
// import { Button } from "../ui/button";

// type Props = { id: string };

// const Profile = ({ id }: Props) => {
//     const router = useRouter();
//     const user = useSelector((state: RootState) => state.auth.user);
//     const [userProfile, setUserProfile] = useState<User | null>(null);
//     const [isLoading, setIsLoading] = useState<boolean>(false);
//     const isOwnProfile=user?._id===id;
//     const isFollowing=user?.following.includes(id);
    

//     useEffect(() => {
//         if (!id) return;

//         setIsLoading(true);
//         setUserProfile(null); // ✅ Clear old profile before loading new one

//         const getUser = async () => {
//             try {
//                 const response = await axios.get(`${BASE_API_URL}/users/profile/${id}`);
//                 setUserProfile(response?.data?.data?.user);
//             } catch (error) {
//                 console.error("Error fetching profile:", error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         getUser();

//         // ✅ Cleanup function (Ensures no memory leak)
//         return () => setUserProfile(null);
//     }, [id]);

//     // ✅ Ensure correct URL when going back
//     useEffect(() => {
//         router.replace(`/profile/${id}`);
//     }, [id, router]);

//     if (isLoading || !userProfile) {
//         return (
//             <div className="w-full h-screen flex items-center justify-center flex-col">
//                 <Loader className="animate-spin" />
//             </div>
//         );
//     }

//     return (
//         <div className="flex mb-20">
//             <div className="w-[20%] hidden md:block border-r-2 h-screen fixed">
//                 <LeftSidebar />
//             </div>
//             <div className="flex-1 md:ml-[20%] overflow-y-auto">
//                 <div className="md:hidden">
//                     <Sheet>
//                         <SheetTrigger>
//                             <MenuIcon />
//                         </SheetTrigger>
//                         <SheetContent>
//                             <LeftSidebar />
//                         </SheetContent>
//                     </Sheet>
//                 </div>
                
//                 {/* ✅ Profile Avatar */}
//                 <div className="w-[90%] sm:w-[90%] mx-auto">
//                     {/*Top Profile */}
//                     <div className="mt-16 flex md:flex-row flex-col md:items-center pb-16 border-b-2 md:space-x-20">
//                     <Avatar className="w-[10rem] h-[10rem] md:8 mb-0 bg-gray-200">
//                          <AvatarImage src={userProfile?.profilePicture} className="h-full w-full rounded-full object-cover" />
//                          <AvatarFallback className="text-black">CN</AvatarFallback>
//                     </Avatar>
//                     <div className="flex items-center space-x-8">
//                         <h1 className="text-2xl font-bold">{userProfile?.username}</h1>
//                         {isOwnProfile &&(<Link href="/editprofile">
//                         <Button variant={"secondary"}>
//                             Edit Profile</Button></Link>)}

//                             {!isOwnProfile &&(
//                                 <Button variant={isFollowing?"destructive":"secondary"}>
//                                     {isFollowing?"Unfollow":"Follow"}
//                                 </Button>
//                             )}
//                     </div>
//                     <div className="flex items-center space-x-8 mt-6 mb-6">
//                           <div>
//                             <span className="font-bold">{userProfile?.posts.length}</span>
//                             <span> Posts</span>
//                           </div>
//                           <div>
//                             <span className="font-bold">{userProfile?.followers.length}</span>
//                             <span> Followers</span>
//                           </div>
//                           <div>
//                             <span className="font-bold">{userProfile?.following.length}</span>
//                             <span> Following</span>
//                           </div>
//                     </div>
//                    <p className="w-[80%] font-medium">{userProfile?.bio||"This is My bio"}</p>
//                 </div>
//             </div>
               
//         </div>
//     </div>
//     );
// };

// export default Profile;

"use client";
import { BASE_API_URL } from "@/server";
import { RootState } from "@/store/store";
import { User } from "@/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Bookmark, Grid, Loader } from "lucide-react";
import LeftSidebar from "../Home/LeftSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Post from "./Post";
import Save from "./Save";

type Props = { id: string };

const Profile = ({ id }: Props) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isOwnProfile = user?._id === id;
  const isFollowing = user?.following.includes(id);
  const[postOrSave,setPostOrSave]=useState<string>("POST");

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setUserProfile(null);

    const getUser = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/users/profile/${id}`);
        setUserProfile(response?.data?.data?.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
    return () => setUserProfile(null);
  }, [id]);

  useEffect(() => {
    router.replace(`/profile/${id}`);
  }, [id, router]);

  if (isLoading || !userProfile) {
    return (
      <div className="w-full h-screen flex items-center justify-center flex-col">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen">
      {/* ✅ Left Sidebar (Fixed) */}
      <div className="w-[20%] hidden md:block border-r h-screen fixed">
        <LeftSidebar />
      </div>

      {/* ✅ Profile Section (Centered) */}
      <div className="flex-1 md:ml-[20%] flex justify-center">
        <div className="w-[80%] max-w-4xl mt-10">
          {/* ✅ Profile Details */}
          <div className="flex items-center space-x-6">
            {/* ✅ Avatar */}
            <Avatar className="w-[8rem] h-[8rem] bg-gray-200">
              <AvatarImage
                src={userProfile?.profilePicture}
                className="h-full w-full rounded-full object-cover"
              />
              <AvatarFallback className="text-black">CN</AvatarFallback>
            </Avatar>

            {/* ✅ Username & Edit Profile */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-semibold">{userProfile?.username}</h1>
                {isOwnProfile ? (
                  <Link href="/edit-profile">
                    <Button className="text-sm cursor-pointer" variant="secondary">
                      Edit Profile
                    </Button>
                  </Link>
                ) : (
                  <Button className="text-sm" variant={isFollowing ? "destructive" : "secondary"}>
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                )}
              </div>

              {/* ✅ Stats & Bio */}
              <div className="flex mt-3 space-x-6">
                <span>
                  <strong>{userProfile?.posts.length}</strong> Posts
                </span>
                <span>
                  <strong>{userProfile?.followers.length}</strong> Followers
                </span>
                <span>
                  <strong>{userProfile?.following.length}</strong> Following
                </span>
              </div>
              <p className="mt-2 text-gray-600">{userProfile?.bio || "My Profile Bio Here"}</p>
            </div>
          </div>
          {/*Bottom Post and save*/}
          <div className="mt-10">
            <div className="flex items-center justify-center space-x-14">
                <div className={cn("flex items-center sapce-x-2 cursor-pointer",postOrSave==="POST"&&"text-blue-500")}
                onClick={()=>setPostOrSave("POST")}>
                  <Grid/>
                  <span className="font-semibold">Post</span> 
                </div>
                <div className={cn("flex items-center sapce-x-2 cursor-pointer",postOrSave==="SAVE"&&"text-blue-500")}
                onClick={()=>setPostOrSave("SAVE")}>
                  <Bookmark/>
                  <span className="font-semibold">SAVE</span> 
                </div>
            </div>
            {postOrSave==="POST"&&<Post userProfile={userProfile}/>}
            {postOrSave==="SAVE"&&<Save userProfile={userProfile}/>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;



