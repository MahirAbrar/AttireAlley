"use client";

import { GlobalContext } from "@/context";
import { adminNavOptions, navOptions } from "@/utils";
import { Fragment, useContext } from "react";
import CommonModal from "../CommonModal";
import { useRouter } from "next/navigation";

const isAdminView = false;
const isAuthUser = true; // logged in

const user = {
  // admin or sth else
  role: "admin",
};

function Navbar() {
  const { showNavModal, setShowNavModal } = useContext(GlobalContext);

  const router = useRouter();

  return (
    <>
      <nav className="fixed start-0 top-0 z-20 w-full border-b border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-900">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
          <a
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8"
              alt="Flowbite Logo"
            />
            <span className="whitespace-nowrap text-sm font-semibold dark:text-white sm:text-xl lg:text-2xl ">
              eComms
            </span>
          </a>
          <div className="flex space-x-3 rtl:space-x-reverse md:order-2 md:space-x-0">
            <div>
              {!isAdminView && isAuthUser ? (
                <Fragment>
                  <button
                    type="button"
                    className="bg-secondary dark:bg-primaryDark dark:text-textDark hover:bg-primary text-text mb-2 me-2 rounded-lg px-5 py-2.5 text-sm font-medium transition delay-150 duration-300 ease-in-out  hover:scale-110 focus:outline-none focus:ring-4 focus:ring-gray-300  dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                  >
                    Account
                  </button>
                  <button
                    type="button"
                    className="bg-secondary dark:bg-primaryDark dark:text-textDark hover:bg-primary text-text mb-2 me-2 rounded-lg px-5 py-2.5 text-sm font-medium transition delay-150 duration-300 ease-in-out  hover:scale-110 focus:outline-none focus:ring-4 focus:ring-gray-300  dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                  >
                    Cart
                  </button>
                </Fragment>
              ) : null}

              {user?.role === "admin" ? (
                isAdminView ? (
                  <button className="bg-secondary dark:bg-primaryDark dark:text-textDark hover:bg-primary text-text mb-2 me-2 rounded-lg px-5 py-2.5 text-sm font-medium transition delay-150 duration-300 ease-in-out  hover:scale-110 focus:outline-none focus:ring-4 focus:ring-gray-300  dark:hover:bg-gray-700 dark:focus:ring-gray-700">
                    Client view
                  </button>
                ) : (
                  <button className="bg-secondary dark:bg-primaryDark dark:text-textDark hover:bg-primary text-text mb-2 me-2 rounded-lg px-5 py-2.5 text-sm font-medium transition delay-150 duration-300 ease-in-out  hover:scale-110 focus:outline-none focus:ring-4 focus:ring-gray-300  dark:hover:bg-gray-700 dark:focus:ring-gray-700">
                    Admin View
                  </button>
                )
              ) : null}
              {isAuthUser ? (
                <button className="bg-secondary dark:bg-primaryDark dark:text-textDark hover:bg-primary text-text mb-2 me-2 rounded-lg px-5 py-2.5 text-sm font-medium transition delay-150 duration-300 ease-in-out  hover:scale-110 focus:outline-none focus:ring-4 focus:ring-gray-300  dark:hover:bg-gray-700 dark:focus:ring-gray-700">
                  Logout
                </button>
              ) : (
                <button
                  className="bg-secondary dark:bg-primaryDark dark:text-textDark hover:bg-primary text-text mb-2 me-2 rounded-lg px-5 py-2.5 text-sm font-medium transition delay-150 duration-300 ease-in-out  hover:scale-110 focus:outline-none focus:ring-4 focus:ring-gray-300  dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                  onClick={() => router.push("./login")}
                >
                  Login
                </button>
              )}
            </div>
            <button
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="hover:bg-secondary dark:hover:bg-secondaryDark text-text inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:focus:ring-gray-600 lg:hidden"
              aria-controls="navbar-sticky"
              aria-expanded="false"
              onClick={() =>
                showNavModal ? setShowNavModal(false) : setShowNavModal(true)
              }
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-5 w-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          <div
            className="w-full items-center justify-between md:order-1 md:flex md:w-auto"
            id="navbar-sticky"
          >
            <ul className="mt-4 hidden flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium rtl:space-x-reverse dark:border-gray-700 dark:bg-gray-800 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0 md:dark:bg-gray-900 lg:flex">
              {isAdminView
                ? adminNavOptions.map((item) => (
                    <li key={item.id}>
                      <a
                        href={item.path}
                        className="hover: bg-secondary hover:bg-primary dark:text-textDark block  rounded px-3 py-2 duration-300 hover:-translate-y-1 hover:scale-110 hover:px-3 hover:py-1 hover:text-white md:bg-transparent md:p-0 "
                        aria-current="page"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))
                : navOptions.map((item) => (
                    <li key={item.id}>
                      <a
                        href={item.path}
                        className="hover: bg-secondary hover:bg-primary dark:text-textDark block  rounded px-3 py-2 duration-300 hover:-translate-y-1 hover:scale-110 hover:px-3 hover:py-1 hover:text-white md:bg-transparent md:p-0 "
                        aria-current="page"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
            </ul>
          </div>
        </div>
      </nav>
      <CommonModal
        showModalTitle={false}
        mainContent={navOptions}
        show={showNavModal}
        setShow={setShowNavModal}
      />
    </>
  );
}

export default Navbar;
