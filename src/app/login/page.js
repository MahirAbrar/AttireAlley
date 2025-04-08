"use client";
import Loader from "@/components/Loader";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useState, useContext } from "react";
import { LoginUser } from "@/services/login";
import { GlobalContext } from "@/context/index";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const Login = () => {
  const router = useRouter();

  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const {
    isAuthUser,
    setIsAuthUser,
    user,
    setUser,
    componentLoader,
    setComponentLoader,
    pageLoader,
    setPageLoader,
  } = useContext(GlobalContext);

  useEffect(() => {
    if (isAuthUser) router.push("/");
  }, [isAuthUser]);

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
    setComponentLoader({ loading: true, id: "" });
    const res = await LoginUser(formState);
    if (res.success) {
      toast.success(res.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });

      setIsAuthUser(true);
      setUser(res.data.user);
      setFormState({ email: "", password: "" });
      router.push("/");
      Cookies.set("token", res?.data?.token);
      localStorage.setItem("user", JSON.stringify(res?.data?.user));
    } else {
      toast.error(res.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
    setComponentLoader({ loading: false, id: "" });
  }

  return (
    <div className="mt-10 w-full rounded-lg bg-white shadow-lg sm:max-w-md md:mt-0 xl:p-0 dark:bg-gray-800">
      <div className="w-auto space-y-4 p-6 sm:p-8 md:space-y-6">
        <h1 className="text-center text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
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
              className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
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
              className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              required=""
            />
          </div>

          {isFormValid() ? (
            <button
              type="submit"
              className="text-white-700 w-full rounded border border-accent  bg-transparent px-4 py-2 font-semibold transition delay-150 duration-300 ease-in-out hover:scale-110 hover:cursor-pointer hover:border-transparent  hover:bg-primary hover:text-white"
              onClick={(e) => handleLoginOnSubmit(e)}
            >
              Login {componentLoader.loading && <Loader />}
            </button>
          ) : (
            <button
              type="submit"
              className="text-white-700  w-full rounded border border-accent bg-transparent px-4 py-2 font-semibold"
              disabled={true}
            >
              Login {componentLoader.loading && <Loader />}
            </button>
          )}
        </form>

        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          {"Don't have an Account?"}
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
  );
};

export default Login;
