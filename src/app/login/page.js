"use client";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { useEffect, useState, useContext, useRef } from "react";
import { LoginUser } from "@/services/login";
import { GlobalContext } from "@/context/index";
import { toast } from "react-toastify";
import { FaFacebook } from "react-icons/fa";
import { gsap } from "gsap";

const Login = () => {
  const router = useRouter();
  const formRef = useRef(null);
  const rightSideRef = useRef(null);

  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const {
    isAuthUser,
    setIsAuthUser,
    setUser,
    componentLoader,
    setComponentLoader,
  } = useContext(GlobalContext);

  useEffect(() => {
    if (isAuthUser) {
      router.push("/");
    }
  }, [isAuthUser, router]);

  useEffect(() => {
    // GSAP animations
    const ctx = gsap.context(() => {
      // Animate left side form
      gsap.fromTo(
        ".form-container",
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }
      );

      // Animate form elements
      gsap.fromTo(
        ".form-element",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.3,
        }
      );

      // Animate right side
      gsap.fromTo(
        rightSideRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: "power3.out" }
      );

      // Animate floating elements
      if (rightSideRef.current) {
        gsap.to(".float-element-1", {
          x: 30,
          y: -30,
          duration: 20,
          repeat: -1,
          yoyo: true,
          ease: "none",
        });

        gsap.to(".float-element-2", {
          x: -30,
          y: 30,
          duration: 15,
          repeat: -1,
          yoyo: true,
          ease: "none",
        });
      }
    });

    return () => ctx.revert();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

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
    <div className="flex min-h-screen">
      {/* Left Side - Form Section */}
      <div className="form-container flex w-full flex-col justify-center px-8 py-12 lg:w-1/2 lg:px-12 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <div className="form-element mb-8">
            <h1 className="text-3xl font-bold text-primary">AttireAlley</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Welcome back! Please login to your account.
            </p>
          </div>

          {/* Form */}
          <form
            ref={formRef}
            className="space-y-6"
            onSubmit={handleLoginOnSubmit}
          >
            <div className="form-element">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formState.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-700"
                placeholder="name@company.com"
                required
              />
            </div>

            <div className="form-element">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formState.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-700"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-element flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="text-sm text-primary hover:text-primary/80"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={!isFormValid() || componentLoader.loading}
              className={`form-element relative w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all duration-200 ${
                isFormValid() && !componentLoader.loading
                  ? "bg-primary hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
                  : "cursor-not-allowed bg-gray-400"
              }`}
            >
              {componentLoader.loading ? (
                <div className="flex items-center justify-center">
                  <Loader />
                  <span className="ml-2">Logging in...</span>
                </div>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="form-element relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500 dark:bg-backgroundDark dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className="form-element grid grid-cols-1 gap-3">
            <button className="group flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2.5 transition-all hover:border-blue-600 hover:bg-gray-50 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
              <FaFacebook className="h-5 w-5 text-blue-600 transition-transform group-hover:scale-110" />
            </button>
          </div>

          {/* Sign up link */}
          <p className="form-element mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => router.push("/register")}
              className="font-semibold text-primary transition-colors hover:text-primary/80"
            >
              Sign up for free
            </button>
          </p>
        </div>
      </div>

      {/* Right Side - Image/Gradient Section */}
      <div
        ref={rightSideRef}
        className="relative hidden overflow-hidden lg:flex lg:w-1/2 lg:items-center lg:justify-center"
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80"></div>

        {/* Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.133 7-7s-3.134-7-7-7-7 3.133-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.133 7-7s-3.134-7-7-7-7 3.133-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 px-12 text-center">
          <h2 className="mb-6 text-4xl font-bold text-white">
            Discover Your Style
          </h2>
          <p className="mx-auto mb-8 max-w-md text-lg text-white/90">
            Join thousands of fashion enthusiasts shopping the latest trends at
            unbeatable prices.
          </p>
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50K+</div>
              <div className="text-sm text-white/80">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">10K+</div>
              <div className="text-sm text-white/80">Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">4.8★</div>
              <div className="text-sm text-white/80">Rating</div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="float-element-1 absolute bottom-0 left-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="float-element-2 absolute right-0 top-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      </div>
    </div>
  );
};

export default Login;
