

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
import { useFollowUnfollow } from "../hooks/use-auth";

type Props = { id: string };

const Profile = ({ id }: Props) => {
  const { handleFollowUnfollow } = useFollowUnfollow();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  // ✅ Always declare `useState` at the top level
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [postOrSave, setPostOrSave] = useState<string>("POST");
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [followerCount, setFollowerCount] = useState<number>(0);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setUserProfile(null);

    const getUser = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/users/profile/${id}`);
        const fetchedUser = response?.data?.data?.user;
        setUserProfile(fetchedUser);

        // ✅ Update follow state after userProfile is fetched
        setIsFollowing(user?.following?.includes(id) || false);
        setFollowerCount(fetchedUser?.followers.length || 0);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
    return () => setUserProfile(null);
  }, [id, user?.following]);

  useEffect(() => {
    router.replace(`/profile/${id}`);
  }, [id, router]);

  const handleFollowClick = async () => {
    const updatedUser = await handleFollowUnfollow(id);
    if (updatedUser) {
      setIsFollowing(updatedUser.following.includes(id));
      setFollowerCount((prev) => (isFollowing ? prev - 1 : prev + 1));
    }
  };

  if (isLoading || !userProfile) {
    return (
      <div className="w-full h-screen flex items-center justify-center flex-col">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen">
      {/* ✅ Left Sidebar */}
      <div className="w-[20%] hidden md:block border-r h-screen fixed">
        <LeftSidebar />
      </div>

      {/* ✅ Profile Section */}
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
                {user?._id === id ? (
                  <Link href="/edit-profile">
                    <Button className="text-sm cursor-pointer" variant="secondary">
                      Edit Profile
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={handleFollowClick}
                    className="text-sm text-white bg-gray-500 cursor-pointer"
                    variant={isFollowing ? "destructive" : "secondary"}
                  >
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
                  <strong>{followerCount}</strong> Followers
                </span>
                <span>
                  <strong>{userProfile?.following.length}</strong> Following
                </span>
              </div>
              <p className="mt-2 text-gray-600">{userProfile?.bio || "My Profile Bio Here"}</p>
            </div>
          </div>

          {/* ✅ Bottom Post & Save */}
          <div className="mt-10">
            <div className="flex items-center justify-center space-x-14">
              <div
                className={cn(
                  "flex items-center space-x-2 cursor-pointer",
                  postOrSave === "POST" && "text-blue-500"
                )}
                onClick={() => setPostOrSave("POST")}
              >
                <Grid />
                <span className="font-semibold">Post</span>
              </div>
              <div
                className={cn(
                  "flex items-center space-x-2 cursor-pointer",
                  postOrSave === "SAVE" && "text-blue-500"
                )}
                onClick={() => setPostOrSave("SAVE")}
              >
                <Bookmark />
                <span className="font-semibold">Save</span>
              </div>
            </div>
            {postOrSave === "POST" && <Post userProfile={userProfile} />}
            {postOrSave === "SAVE" && <Save userProfile={userProfile} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


