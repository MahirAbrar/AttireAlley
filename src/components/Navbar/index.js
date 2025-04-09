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
    isDark,
    setIsDark,
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
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY) { // scrolling down
          setIsVisible(false);
        } else { // scrolling up
          setIsVisible(true);
        }
        
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);

    return () => {
      window.removeEventListener('scroll', controlNavbar);
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
          mounted && isDark ? 'bg-backgroundDark' : 'bg-background'
        } sticky top-0 z-50 shadow-lg px-6 py-6 border-b-2 border-primary/20 hover:border-primary/60 hover:shadow-[0_0_15px_rgba(0,173,181,0.3)] transition-all duration-300 transform ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${mounted && isDark ? 'dark' : ''}`}
      >
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className={`flex items-center gap-2.5 text-2xl 2xl:text-4xl font-bold ${
              isDark ? 'text-textDark' : 'text-text'
            } no-underline transition-all duration-300 hover:text-primary hover:drop-shadow-[0_0_15px_rgba(0,173,181,0.5)] hover:scale-105 border-2 border-transparent hover:border-primary rounded-lg px-4 py-2`}
            onClick={handleLinkClick("/")}
          >
            <ShoppingBagIcon className="h-8 2xl:h-12 w-8 2xl:w-12 text-primary transition-all duration-300" />
            <span>AttireAlley</span>
          </Link>

          <div className="hidden lg:flex">
            <ul className="flex gap-6 2xl:gap-8">
              {isAdminView
                ? adminNavOptions.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.path}
                        className={`nav-link text-lg 2xl:text-xl ${
                          isDark ? 'text-textDark' : 'text-text'
                        } font-medium px-4 py-2 ${
                          item.active ? "active" : ""
                        }`}
                        onClick={() => handleLinkClick(item.path)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))
                : navOptions.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.path}
                        className={`nav-link text-lg 2xl:text-xl ${
                          isDark ? 'text-textDark' : 'text-text'
                        } font-medium px-4 py-2 ${
                          item.active ? "active" : ""
                        }`}
                        onClick={() => handleLinkClick(item.path)}
                      >
                        {item.label}
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
                  className="relative z-[1001] transition-all duration-300 hover:scale-110 [&>div>svg]:hover:text-primary"
                >
                  <div className="indicator">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 2xl:h-8 w-6 2xl:w-8 text-textDark transition-colors duration-300"
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
                    <span className="badge indicator-item badge-xs 2xl:badge-sm bg-primary text-textDark">
                      {cartDisplay}
                    </span>
                  </div>
                </div>
                <div className="relative z-[1000]">
                  <div
                    tabIndex={0}
                    className="card dropdown-content card-compact w-52 bg-backgroundDark shadow-lg"
                  >
                    <div className="card-body">
                      <span className="text-lg font-bold text-textDark">
                        {cartDisplay} Items
                      </span>
                      <span className="text-primary">Subtotal: ${cartAmount}</span>
                      <div className="card-actions">
                        <button
                          className="btn btn-primary btn-block bg-primary text-textDark hover:bg-primary/90"
                          onClick={() => router.push("/cart")}
                        >
                          View cart
                        </button>
                        <button
                          className="btn btn-primary btn-block bg-primary text-textDark hover:bg-primary/90"
                          onClick={() => router.push("/account")}
                        >
                          Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {user?.role === "admin" ? (
              isAdminView ? (
                <NeonButton
                  onClick={handleLinkClick("/")}
                  className="text-textDark"
                >
                  Client view
                </NeonButton>
              ) : (
                <NeonButton
                  onClick={handleLinkClick("/admin-view")}
                  className="text-textDark"
                >
                  Admin View
                </NeonButton>
              )
            ) : null}

            {isAuthUser ? (
              <NeonButton
                onClick={handleLogout}
                className="text-textDark"
              >
                Logout
              </NeonButton>
            ) : (
              <NeonButton
                className="text-textDark"
                onClick={handleLinkClick("/login")}
              >
                Login
              </NeonButton>
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
                  className="swap-off fill-current text-textDark"
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 512 512"
                >
                  <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
                </svg>
                <svg
                  className="swap-on fill-current text-textDark"
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
