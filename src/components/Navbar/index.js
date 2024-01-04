"use client";

import { GlobalContext } from "@/context";
import { adminNavOptions, navOptions } from "@/utils";
import { Fragment, useContext, useEffect, useRef, useCallback } from "react";
import CommonModal from "../CommonModal";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

function Navbar() {
  const {
    showNavModal,
    setShowNavModal,
    isAuthUser,
    user,
    setIsAuthUser,
    setUser,
  } = useContext(GlobalContext);

  const router = useRouter();
  const pathName = usePathname();
  const isAdminView = pathName.includes("admin-view");
  console.log(isAdminView);

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
      <nav className="sticky start-0 top-0 z-20 mx-auto flex w-full max-w-screen-xl flex-wrap items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-600 dark:bg-gray-900">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
          onClick={handleLinkClick("/")}
        >
          <span className="whitespace-nowrap text-sm font-semibold dark:text-white sm:text-xl lg:text-2xl ">
            eComms
          </span>
        </Link>
        <div className="flex space-x-3 rtl:space-x-reverse md:order-2 md:space-x-0">
          <div>
            {!isAdminView && isAuthUser ? (
              <Fragment>
                <button
                  type="button"
                  className="btn btn-md mx-1  md:btn-md lg:btn-lg "
                >
                  Account
                </button>
                <button
                  type="button"
                  className="btn btn-md mx-1  md:btn-md lg:btn-lg "
                >
                  Cart
                </button>
              </Fragment>
            ) : null}

            {user?.role === "admin" ? (
              isAdminView ? (
                <button
                  onClick={handleLinkClick("/")}
                  className="btn btn-md mx-1  md:btn-md lg:btn-lg "
                >
                  Client view
                </button>
              ) : (
                <button
                  onClick={handleLinkClick("/admin-view")}
                  className="btn btn-md mx-1  md:btn-md lg:btn-lg "
                >
                  Admin View
                </button>
              )
            ) : null}
            {isAuthUser ? (
              <button
                onClick={handleLogout}
                className="btn btn-md mx-1  md:btn-md lg:btn-lg "
              >
                Logout
              </button>
            ) : (
              <button
                className="btn btn-md mx-1  md:btn-md lg:btn-lg "
                onClick={handleLinkClick("/login")}
              >
                Login
              </button>
            )}
          </div>

          <div className=" lg:hidden">
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
        <div
          className="w-full items-center justify-between md:order-1 md:flex md:w-auto"
          id="navbar-sticky"
        >
          <ul className="mt-4 hidden flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium rtl:space-x-reverse dark:border-gray-700 dark:bg-gray-800 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0 md:dark:bg-gray-900 lg:flex">
            {isAdminView
              ? adminNavOptions.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.path}
                      className="hover: block rounded bg-secondary px-3  py-2 duration-300 hover:-translate-y-1 hover:scale-110 hover:bg-primary hover:px-3 hover:py-1 hover:text-white dark:text-textDark md:bg-transparent md:p-0 "
                      aria-current="page"
                      onClick={handleLinkClick(`${item.path}`)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))
              : navOptions.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.path}
                      className="hover: block rounded bg-secondary px-3  py-2 duration-300 hover:-translate-y-1 hover:scale-110 hover:bg-primary hover:px-3 hover:py-1 hover:text-white dark:text-textDark md:bg-transparent md:p-0 "
                      aria-current="page"
                      onClick={handleLinkClick(`${item.path}`)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
          </ul>
        </div>
      </nav>
      <CommonModal
        showModalTitle={false}
        mainContent={navOptions}
        show={showNavModal}
        setShow={setShowNavModal}
        router={router}
        checkBoxRef={checkBoxRef}
      />
    </>
  );
}

export default Navbar;
