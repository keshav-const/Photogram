

"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import Image from "next/image";
import PasswordInput from "./PasswordInput";
import LoadingButton from "../Helper/LoadingButton";
import Link from "next/link";
import { BASE_API_URL } from "@/server";
import axios from "axios";
//import { handleAuthRequest } from "../utils/apiRequest";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/store/authSlice";
import { useRouter } from "next/navigation";

interface FormData {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const Signup = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      console.log("BASE_API_URL:", BASE_API_URL);
      console.log("Submitting to:", `${BASE_API_URL}/users/signup`);

      const { data } = await axios.post(
        `${BASE_API_URL}/users/signup`,
        formData,
        { withCredentials: true }
      );

      console.log("Signup Response:", data); // Debugging ke liye

      const user = data?.user || data?.data?.user || null; // Multiple formats handle karega

      if (user) {
        dispatch(setAuthUser(user));
        toast.success(data.message || "Signup successful!");
        router.push("/auth/verify");
      } else {
        toast.error(data.message || "Signup failed!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
        {/* Banner */}
        <div className="lg:col-span-4 h-screen hidden lg:block">
          <Image
            src="/images/banner.png"
            alt="Sign Up Banner"
            width={1000}
            height={1000}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Form */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center h-screen">
          <h1 className="font-bold text-xl sm:text-2xl text-left uppercase mb-8">
            Sign UP with <span className="text-rose-800">PhotoGram</span>
          </h1>
          <form
            onSubmit={handleSubmit}
            className="block w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]"
          >
            <div className="mb-4">
              <label htmlFor="name" className="font-semibold mb-2 block">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="px-4 py-3 bg-gray-200 rounded-lg w-full block outline-none"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="font-semibold mb-2 block">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email id"
                className="px-4 py-3 bg-gray-200 rounded-lg w-full block outline-none"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <PasswordInput
                label="Password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <PasswordInput
                name="passwordConfirm"
                label="Confirm Password"
                placeholder="Confirm Password"
                value={formData.passwordConfirm}
                onChange={handleChange}
              />
            </div>

            <LoadingButton size={"lg"}  className="w-full mt-3 bg-black hover:bg-black text-white px-6 py-3 rounded-lg" type="submit" isLoading={isLoading}>
              Sign Up
            </LoadingButton>
          </form>

          <h1 className="mt-4 text-lg text-gray-800">
            Already Have an Account?{" "}
            <Link href="/auth/login">
              <span className="text-blue-800 underline cursor-pointer font-medium">
                Login here
              </span>{" "}
            </Link>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Signup;
