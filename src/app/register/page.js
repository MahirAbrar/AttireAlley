"use client";

import React, { useEffect, useContext } from "react";
import { GlobalContext } from "@/context/index";
import RegisterForm from "./registerForm";
import { useRouter } from "next/navigation";

const isRegistered = false;

const register = () => {
  const { isAuthUser } = useContext(GlobalContext);
  const router = useRouter();

  useEffect(() => {
    if (isAuthUser) {
      router.push("/");
    }
  }, [isAuthUser]);

  return (
    <div>
      <div className="mx-auto flex h-screen flex-col items-center justify-center bg-background px-6 dark:bg-backgroundDark  lg:py-0">
        <div className="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
              Sign up
            </h1>

            {/* paste here */}
            {!isRegistered ? (
              <RegisterForm />
            ) : (
              <div className="text-center">
                <h1 className="text-center text-xl">Already Registered!</h1>{" "}
                <a href="">
                  <button className="text-white-700  m-3 rounded border border-blue-500 bg-blue-500 bg-transparent px-4 py-2 font-semibold transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:border-transparent hover:bg-indigo-500 hover:text-white">
                    {" "}
                    Client view
                  </button>{" "}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default register;
