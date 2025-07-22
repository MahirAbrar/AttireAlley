"use client";

import { GlobalContext } from "@/context";
import { adminNavOptions, navOptions } from "@/utils";
import { useContext, useRef, useCallback, useEffect, useState } from "react";
import CommonModal from "../CommonModal";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { getCartItems } from "@/services/getCartItems";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import DarkModeToggle from "../DarkModeToggle";
import NeonButton from "../NeonButton";
import "@/styles/navbar.css";
import { clearConfigCache } from "prettier";

function Navbar() {
  const {
    showNavModal,
    setShowNavModal,
    isAuthUser,
    user,
    setIsAuthUser,
    setUser,
    navbarUpdateTrigger,
    isDark,
  } = useContext(GlobalContext);

  const [cartDisplay, setCartDisplay] = useState(0);
  const [cartAmount, setCartAmount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const pathName = usePathname();
  const isAdminView = pathName.includes("admin-view");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        const currentScrollY = window.scrollY;
        const SCROLL_THRESHOLD = 30; // Adjust this value as needed

        if (currentScrollY < 85) {
          // At the top of the page
          setIsVisible(true);
        } else if (currentScrollY > lastScrollY) {
          // scrolling down
          setIsVisible(false);
        } else if (lastScrollY - currentScrollY > SCROLL_THRESHOLD) {
          // scrolling up by a significant amount
          setIsVisible(true);
        }

        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener("scroll", controlNavbar);

    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (isAuthUser && user) {
        const { success, data, isExpired } = await getCartItems(user._id);
        console.log(isExpired, success, data);
        if (isExpired) {
          // Token has expired, update state variables
          setIsAuthUser(false);
          setUser(null);
          localStorage.removeItem("user");
          Cookies.remove("token");
        } else if (success) {
          setCartDisplay(data.length);
          setCartAmount(
            data.reduce(
              (acc, item) =>
                acc + (item.productID.price - item.productID.priceDrop),
              0,
            ),
          );
        }
      }
    };

    fetchCartItems();
  }, [isAuthUser, user, navbarUpdateTrigger, setIsAuthUser, setUser]);

  const handleLogout = useCallback(() => {
    setIsAuthUser(false);
    Cookies.remove("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
    toast.success("Logged out successfully");
  }, [setIsAuthUser, setUser, router]);

  const checkBoxRef = useRef(null);

  const handleNavModalToggle = useCallback(() => {
    setShowNavModal((prevShowNavModal) => !prevShowNavModal);
  }, [setShowNavModal]);

  const handleLinkClick = useCallback(
    (path) => (e) => {
      e.preventDefault();
      router.push(path);
    },
    [router],
  );

  return (
    <>
      <nav
        className={`${
          mounted && isDark ? "bg-backgroundDark" : "bg-gray-100"
        } sticky top-0 z-50 transform border-b-2 border-primary/20 px-2 py-6 shadow-lg transition-all duration-300 hover:border-primary/60 hover:shadow-[0_0_15px_rgba(87,167,168,0.3)] sm:px-6 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${mounted && isDark ? "dark" : ""}`}
      >
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-3 text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white transition-all duration-300 hover:scale-105"
            onClick={handleLinkClick("/")}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary rounded-xl blur-lg opacity-0 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-primary p-2.5 lg:p-3 xl:p-3.5 rounded-xl group-hover:shadow-[0_0_15px_rgba(87,167,168,0.5)] transition-all">
                <ShoppingBagIcon className="h-7 w-7 lg:h-8 lg:w-8 xl:h-10 xl:w-10 text-white" />
              </div>
            </div>
            <span className="text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">
              AttireAlley
            </span>
          </Link>

          <div className="hidden lg:flex">
            <ul className="flex gap-6 2xl:gap-8">
              {isAdminView
                ? adminNavOptions.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.path}
                        className="relative text-gray-700 dark:text-gray-300 px-4 py-2 font-medium text-lg xl:text-xl 2xl:text-2xl transition-all duration-300 hover:text-primary dark:hover:text-primary group"
                        onClick={() => handleLinkClick(item.path)}
                      >
                        {item.label}
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                      </Link>
                    </li>
                  ))
                : navOptions.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.path}
                        className="relative text-gray-700 dark:text-gray-300 px-4 py-2 font-medium text-lg xl:text-xl 2xl:text-2xl transition-all duration-300 hover:text-primary dark:hover:text-primary group"
                        onClick={() => handleLinkClick(item.path)}
                      >
                        {item.label}
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                      </Link>
                    </li>
                  ))}
            </ul>
          </div>

          <div className="flex items-center gap-4 2xl:gap-6">
            <DarkModeToggle />
            {isAuthUser && !isAdminView ? (
              <div className="dropdown dropdown-bottom">
                <div
                  tabIndex={0}
                  role="button"
                  className="relative z-[1001] transition-all duration-300 hover:scale-110"
                >
                  <div className="indicator">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-700 dark:text-gray-300 transition-colors duration-300 hover:text-primary 2xl:h-8 2xl:w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {cartDisplay > 0 && (
                      <span className="badge indicator-item badge-sm bg-primary text-white border-0 2xl:badge-md">
                        {cartDisplay}
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative z-[1000] mt-2">
                  <div
                    tabIndex={0}
                    className="card dropdown-content card-compact w-64 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700"
                  >
                    <div className="card-body">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          Cart ({cartDisplay})
                        </span>
                        <span className="text-md font-semibold text-primary">
                          ${cartAmount}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <button
                          className="w-full btn bg-primary text-white border-0 hover:bg-primary/90 hover:shadow-[0_0_15px_rgba(87,167,168,0.3)] transition-all"
                          onClick={() => router.push("/cart")}
                        >
                          View Cart
                        </button>
                        <button
                          className="w-full btn btn-outline border-primary text-primary hover:bg-primary hover:text-white"
                          onClick={() => router.push("/order")}
                        >
                          My Orders
                        </button>
                        <button
                          className="w-full btn btn-ghost text-gray-700 dark:text-gray-300"
                          onClick={() => router.push("/account")}
                        >
                          My Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {user?.role === "admin" ? (
              isAdminView ? (
                <button
                  onClick={handleLinkClick("/")}
                  className="px-4 py-2 text-sm lg:text-base xl:text-lg font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
                >
                  Client View
                </button>
              ) : (
                <button
                  onClick={handleLinkClick("/admin-view")}
                  className="px-4 py-2 text-sm lg:text-base xl:text-lg font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
                >
                  Admin View
                </button>
              )
            ) : null}

            {isAuthUser ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm lg:text-base xl:text-lg font-medium bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-all duration-300"
              >
                Logout
              </button>
            ) : (
              <button
                className="px-4 py-2 text-sm lg:text-base xl:text-lg font-medium bg-primary text-white rounded-lg hover:bg-primary/90 hover:shadow-[0_0_15px_rgba(87,167,168,0.3)] transition-all duration-300"
                onClick={handleLinkClick("/login")}
              >
                Login
              </button>
            )}

            <div className="lg:hidden">
              <label className="btn btn-circle swap swap-rotate">
                <input
                  type="checkbox"
                  onClick={handleNavModalToggle}
                  ref={checkBoxRef}
                />
                <span className="sr-only">Open main menu</span>
                <svg
                  className="swap-off h-6  w-6 fill-current sm:h-8 sm:w-8"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
                </svg>
                <svg
                  className="swap-on h-6  w-6 fill-current sm:h-8 sm:w-8"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                </svg>
              </label>
            </div>
          </div>
        </div>
      </nav>
      <CommonModal
        showModalTitle={false}
        navOptions={navOptions}
        adminNavOptions={adminNavOptions}
        isAdminView={isAdminView}
        show={showNavModal}
        setShow={setShowNavModal}
        router={router}
        checkBoxRef={checkBoxRef}
      />
    </>
  );
}

export default Navbar;
