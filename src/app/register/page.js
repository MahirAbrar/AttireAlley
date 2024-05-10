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
    <>
      <div className="w-full rounded-lg bg-white shadow-lg sm:max-w-md md:mt-0 xl:p-0 dark:bg-gray-800">
        <div className="space-y-4 rounded-lg border-2 border-gray-200 p-6 sm:p-8 md:space-y-6 dark:border-gray-700">
          <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Sign up
          </h1>
          {/* paste here */}
          {!isRegistered ? (
            <RegisterForm />
          ) : (
            <div className="text-center">
              <h1 className="text-center text-xl font-semibold text-gray-800 dark:text-gray-200">
                Already Registered!
              </h1>{" "}
              <a href="">
                <button className="m-3 rounded-lg border border-blue-500 bg-blue-500 bg-transparent px-4 py-2 font-semibold text-white transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:border-transparent hover:bg-indigo-500 hover:text-white dark:bg-blue-600 dark:hover:bg-indigo-600">
                  {" "}
                  Client view
                </button>{" "}
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default register;
