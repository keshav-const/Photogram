"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import Image from "next/image";
import PasswordInput from "./PasswordInput";
import LoadingButton from "../Helper/LoadingButton";
import Link from "next/link";
import { BASE_API_URL } from "@/server";
import axios from "axios";
import { handleAuthRequest } from "../utils/apiRequest";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/store/authSlice";
import { useRouter } from "next/navigation";

interface FormData {
  email: string;
  password: string;
}

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // ❌ Form reload hone se rokta hai  
    console.log("Login button clicked!"); // ✅ Debugging ke liye  

    setIsLoading(true); // ✅ Loading state true kiya

    try {
      const loginReq = async () => {
        console.log("Sending API Request to:", `${BASE_API_URL}/users/login`); // ✅ API Debug  
        return await axios.post(
          `${BASE_API_URL}/users/login`,
          formData,
          { withCredentials: true }
        );
      };

      const result: any = await handleAuthRequest(loginReq, setIsLoading);

      console.log("Login API Response:", result); // ✅ Debugging  

      if (result && result.data) {
        dispatch(setAuthUser(result.data.data.user));
        toast.success(result.data.message || "Login successful!");
        router.push("/");
      } else {
        toast.error("Login failed! Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("An error occurred while logging in.");
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
            alt="Login Banner"
            width={1000}
            height={1000}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Form */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center h-screen">
          <h1 className="font-bold text-xl sm:text-2xl text-left uppercase mb-8">
            Login with <span className="text-rose-800">PhotoGram</span>
          </h1>
          <form
            onSubmit={handleSubmit}
            className="block w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]"
          >
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
              <Link href="/auth/forget-password" className="mt-2 text-red-600 block font-semibold text-base cursor-pointer text-right">
                Forget password?
              </Link>
            </div>

            {/* ✅ Fixed Button */}
            {/* <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg w-full mt-3"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button> */}
            <LoadingButton 
                size={"lg"} 
                className="w-full mt-3 bg-black hover:bg-black text-white px-6 py-3 rounded-lg"
                type="submit" 
                isLoading={isLoading}>
                        Login
        </LoadingButton>


          </form>

          <h1 className="mt-4 text-lg text-gray-800">
          Don&apos;t  have an Account?{" "}
            <Link href="/auth/signup">
              <span className="text-blue-800 underline cursor-pointer font-medium">
                SignUp here
              </span>
            </Link>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Login;
