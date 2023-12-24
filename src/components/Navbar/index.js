"use client"

import { GlobalContext } from "@/context";
import { adminNavOptions, navOptions } from "@/utils";
import { Fragment, useContext } from "react";
import CommonModal from "../CommonModal";
import { useRouter } from 'next/navigation';


const btnStyle = "text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 transition ease-in-out delay-150 bg-blue-500 hover:scale-110 hover:bg-indigo-500 duration-300"

const isAdminView = false;
const isAuthUser = false;         // logged in

const user = {
  role: "admin"
}



function Navbar() {

  const { showNavModal, setShowNavModal } = useContext(GlobalContext)

  const router = useRouter()

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
            <span className="text-sm sm:text-xl lg:text-2xl font-semibold whitespace-nowrap dark:text-white ">eComms</span>
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <div>
              {
                !isAdminView && isAuthUser ? (
                  <Fragment>
                    <button type="button" className={btnStyle}>Account</button>
                    <button type="button" className={btnStyle}>Cart</button>
                  </Fragment>
                ) : null
              }

              {user?.role === "admin" ?
                isAdminView ? <button className={btnStyle}> Client view</button> : <button className={btnStyle}> Admin View</button>
                : null}
              {isAuthUser ? <button className={btnStyle} >Logout</button> : <button className={btnStyle} onClick={() => router.push("./login")}>Login</button>}
            </div>
            <button data-collapse-toggle="navbar-sticky" type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-sticky" aria-expanded="false" onClick={() => showNavModal ? setShowNavModal(false) : setShowNavModal(true)}>
              <span className="sr-only">Open main menu</span>
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
              </svg>
            </button>
          </div>
          <div className="items-center justify-between w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
            <ul className="hidden lg:flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">

              {
                isAdminView ? adminNavOptions.map(item => (<li key={item.id}>

                  <a href={item.path} className=" block py-2 px-3 text-white bg-blue-700 rounded mx-5  md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-slate-700 hover:px-3 hover:py-1 duration-300" aria-current="page">{item.label}</a>
                </li>)) : navOptions.map(item => (<li key={item.id}>
                  <a href={item.path} className="block py-2 px-3 text-white bg-blue-700 rounded px-2  md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-slate-700 hover:px-3 hover:py-1 duration-300" aria-current="page">{item.label}</a>
                </li>))
              }
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
  )
}

export default Navbar