"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useState } from "react";
import { loginUser } from "@/app/services/login";

const btnStyle =
  "mt-2 w-full bg-transparent hover:bg-blue-700 text-white-700  font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded transition ease-in-out delay-150 bg-blue-500 hover:scale-110 hover:bg-indigo-500 duration-300 hover:";

const login = () => {
  const router = useRouter();

  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const [nameTyped, setNameTyped] = useState(false);
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  function isFormValid() {
    return formState &&
      formState.email &&
      formState.email.trim() !== "" &&
      formState.password &&
      formState.password.trim() !== "" &&
      emailRegex.test(formState.email)
      ? true
      : false;
  }

  async function handleLoginOnSubmit(e) {
    // calls database and save the data
    e.preventDefault();
    console.log("submitting login form");
    const res = await loginUser(formState);
    console.log(res);
  }

  return (
    <div>
      <section className="bg-background dark:bg-backgroundDark">
        <div className=" mx-auto flex h-screen flex-col items-center justify-center px-6 py-8 lg:py-0">
          <div className="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
            <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
              <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
                Login to your account
              </h1>

              <form className="space-y-4 md:space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    id="email"
                    className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                    placeholder="name@company.com"
                    required=""
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    onChange={handleChange}
                    id="password"
                    placeholder="Password"
                    className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                    required=""
                  />
                </div>

                {isFormValid() ? (
                  <button
                    type="submit"
                    className="text-white-700 w-full rounded border border-accent  bg-transparent px-4 py-2 font-semibold transition delay-150 duration-300 ease-in-out hover:scale-110 hover:cursor-pointer hover:border-transparent  hover:bg-primary hover:text-white"
                    onClick={(e) => handleLoginOnSubmit(e)}
                  >
                    Login
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="text-white-700  w-full rounded border border-accent bg-transparent px-4 py-2 font-semibold"
                    disabled={true}
                  >
                    Login
                  </button>
                )}
              </form>

              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Not have an Account?
              </p>
              <button
                type="submit"
                className="text-white-700 w-full rounded border border-accent  bg-transparent px-4 py-2 font-semibold transition delay-150 duration-300 ease-in-out hover:scale-110 hover:cursor-pointer hover:border-transparent  hover:bg-primary hover:text-white"
                onClick={() => router.push("/register")}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default login;
