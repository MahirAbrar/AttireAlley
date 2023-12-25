"use client";

import React from "react";
import RegisterForm from "./registerForm";

const isRegistered = false;
const btnStyle =
  "bg-transparent hover:bg-blue-500 text-white-700 font-semibold hover:text-white py-2 px-4 m-3 border border-blue-500 hover:border-transparent rounded transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300";

const register = () => {
  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className=" mx-auto flex h-screen flex-col items-center justify-center px-6 py-8  lg:py-0">
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
                    <button className={btnStyle}> Client view</button>{" "}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default register;
