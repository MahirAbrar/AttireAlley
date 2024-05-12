"use client";

import { GlobalContext } from "@/context";
import { adminNavOptions, navOptions } from "@/utils";
import { useContext, useRef, useCallback, useEffect, useState } from "react";
import CommonModal from "../CommonModal";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { getCartItems } from "@/app/services/getCartItems";

function Navbar() {
  const {
    showNavModal,
    setShowNavModal,
    isAuthUser,
    user,
    setIsAuthUser,
    setUser,
    cartItemsCount,
    navbarUpdateTrigger,
  } = useContext(GlobalContext);

  const [cartDisplay, setCartDisplay] = useState(0);
  const [cartAmount, setCartAmount] = useState(0);

  const router = useRouter();
  const pathName = usePathname();
  const isAdminView = pathName.includes("admin-view");

  useEffect(() => {
    const fetchCartItems = async () => {
      if (isAuthUser && user) {
        const { success, data, isExpired } = await getCartItems(user._id);
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
          console.log(data);
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
      <nav className="navbar px-2 dark:bg-gray-800">
        <div className="navbar-start">
          <Link
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
            onClick={handleLinkClick("/")}
          >
            <span className="whitespace-nowrap text-sm font-semibold sm:text-xl lg:text-2xl dark:text-white">
              AttireAlley
            </span>
          </Link>
          <div />
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-vertical m-0 list-none rounded p-0 text-right lg:menu-horizontal">
            {isAdminView
              ? adminNavOptions.map((item) => (
                  <li key={item.id} className="ml-2 inline-block">
                    <Link
                      href={item.path}
                      className={`text-sm uppercase transition-colors duration-300 ease-in-out hover:text-red-500 ${
                        item.active
                          ? "text-red-500"
                          : "text-gray-800 dark:text-white"
                      }`}
                      aria-current="page"
                      onClick={() => handleLinkClick(item.path)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))
              : navOptions.map((item) => (
                  <li key={item.id} className="ml-2 inline-block">
                    <Link
                      href={item.path}
                      className={`text-sm uppercase transition-colors duration-300 ease-in-out hover:text-red-500 ${
                        item.active
                          ? "text-red-500"
                          : "text-gray-800 dark:text-white"
                      }`}
                      aria-current="page"
                      onClick={() => handleLinkClick(item.path)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
          </ul>
        </div>

        <div className="navbar-end">
          {isAuthUser && !isAdminView ? (
            <div className="dropdown dropdown-bottom">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-circle btn-ghost"
              >
                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
                  <span className="badge indicator-item badge-sm">
                    {cartDisplay}
                  </span>
                </div>
                <div
                  tabIndex={0}
                  className="card dropdown-content card-compact z-[1] w-52 bg-base-100 shadow"
                >
                  <div className="card-body">
                    <span className="text-lg font-bold">
                      {cartDisplay} Items
                    </span>
                    <span className="text-info">Subtotal: ${cartAmount}</span>
                    <div className="card-actions">
                      <button
                        className="btn btn-primary btn-block"
                        onClick={() => router.push("/cart")}
                      >
                        View cart
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
                className="btn btn-md mx-1 bg-gray-200 md:btn-md lg:btn-lg dark:bg-gray-700"
              >
                Client view
              </button>
            ) : (
              <button
                onClick={handleLinkClick("/admin-view")}
                className="btn btn-md mx-1 bg-gray-200 md:btn-md lg:btn-lg dark:bg-gray-700"
              >
                Admin View
              </button>
            )
          ) : null}
          {isAuthUser ? (
            <button
              onClick={handleLogout}
              className="btn btn-md mx-1 bg-gray-200 md:btn-md lg:btn-lg dark:bg-gray-700"
            >
              Logout
            </button>
          ) : (
            <button
              className="btn btn-md mx-1 bg-gray-200 md:btn-md lg:btn-lg dark:bg-gray-700"
              onClick={handleLinkClick("/login")}
            >
              Login
            </button>
          )}

          <div className="lg:hidden">
            <label className="btn btn-circle swap swap-rotate">
              {/* this hidden checkbox controls the state */}
              <input
                type="checkbox"
                onClick={handleNavModalToggle}
                ref={checkBoxRef}
              />
              <span className="sr-only">Open main menu</span>
              {/* hamburger icon */}

              {/* closed menu showing hamburger */}

              <svg
                className="swap-off fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
              </svg>
              <svg
                className="swap-on fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
              </svg>
            </label>
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
