"use client";

import { GlobalContext } from "@/context";
import { adminNavOptions, navOptions } from "@/utils";
import { useContext, useRef, useCallback, useEffect, useState } from "react";
import CommonModal from "../CommonModal";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { getCartItems } from "@/services/getCartItems";
import {
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import DarkModeToggle from "../DarkModeToggle";
import "@/styles/navbar.css";

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
  const [scrolled, setScrolled] = useState(false);
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
        const SCROLL_THRESHOLD = 30;

        setScrolled(currentScrollY > 30);

        if (currentScrollY < 85) {
          setIsVisible(true);
        } else if (currentScrollY > lastScrollY) {
          setIsVisible(false);
        } else if (lastScrollY - currentScrollY > SCROLL_THRESHOLD) {
          setIsVisible(true);
        }

        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (isAuthUser && user) {
        const { success, data, isExpired } = await getCartItems(user._id);
        if (isExpired) {
          setIsAuthUser(false);
          setUser(null);
        } else if (success) {
          setCartDisplay(data.length);
          setCartAmount(
            data.reduce(
              (acc, item) =>
                acc + (item.productID.price - item.productID.priceDrop),
              0
            )
          );
        }
      }
    };

    fetchCartItems();
  }, [isAuthUser, user, navbarUpdateTrigger, setIsAuthUser, setUser]);

  const handleLogout = useCallback(async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setIsAuthUser(false);
        setUser(null);
        router.push("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
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
    [router]
  );

  const overDark = pathName === "/" && !scrolled;

  const navLinkClass = `relative text-[13px] uppercase tracking-[0.18em] font-medium transition-colors duration-200 after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 ${
    overDark
      ? "text-white/85 hover:text-white"
      : "text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
  }`;

  const iconButtonClass = `flex h-11 w-11 items-center justify-center transition-colors duration-200 ${
    overDark
      ? "text-white/85 hover:text-white"
      : "text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
  }`;

  const wordmarkClass = `font-display italic text-[24px] font-normal leading-none ${
    overDark ? "text-white" : "text-neutral-900 dark:text-white"
  }`;

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transform px-4 py-5 transition-all duration-300 sm:px-8 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${
          scrolled
            ? "border-b border-neutral-200/60 bg-white/85 backdrop-blur-md dark:border-white/10 dark:bg-backgroundDark/85"
            : "bg-transparent"
        } ${mounted && isDark ? "dark" : ""}`}
      >
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5"
            onClick={handleLinkClick("/")}
          >
            <span
              className="inline-block h-[10px] w-[10px] rounded-full bg-primary shadow-[0_0_0_3px_rgba(87,167,168,.18),0_0_12px_rgba(87,167,168,.7)]"
              aria-hidden="true"
            />
            <span className={wordmarkClass}>
              Attire Alley
            </span>
          </Link>

          <div className="hidden lg:flex">
            <ul className="flex items-center gap-8">
              {isAdminView
                ? adminNavOptions.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.path}
                        className={navLinkClass}
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
                        className={navLinkClass}
                        onClick={() => handleLinkClick(item.path)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
            </ul>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/aipage"
              className={`hidden lg:inline-flex ${navLinkClass}`}
            >
              AI Stylist
            </Link>

            <button className={iconButtonClass} aria-label="Search">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>

            <Link
              href={isAuthUser ? "/account" : "/login"}
              className={iconButtonClass}
              aria-label="Account"
            >
              <UserIcon className="h-5 w-5" />
            </Link>

            {isAuthUser && !isAdminView ? (
              <div className="dropdown dropdown-bottom dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className={`relative ${iconButtonClass}`}
                >
                  <ShoppingBagIcon className="h-5 w-5" />
                  {cartDisplay > 0 && (
                    <span
                      className={`absolute -right-0.5 -top-0.5 flex min-w-[18px] items-center justify-center rounded-full px-1.5 py-px text-[10px] font-medium leading-none ${
                        overDark
                          ? "bg-white text-neutral-900"
                          : "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                      }`}
                    >
                      {cartDisplay}
                    </span>
                  )}
                </div>
                <div className="relative z-[1000]">
                  <div
                    tabIndex={0}
                    className="card dropdown-content card-compact w-64 border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900"
                  >
                    <div className="card-body">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                          Cart ({cartDisplay})
                        </span>
                        <span className="text-sm font-medium text-primary">
                          ${cartAmount}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <button
                          className="btn w-full border-0 bg-neutral-900 text-white hover:bg-primary dark:bg-white dark:text-neutral-900 dark:hover:bg-primary dark:hover:text-white"
                          onClick={() => router.push("/cart")}
                        >
                          View Cart
                        </button>
                        <button
                          className="btn btn-outline w-full border-neutral-200 text-neutral-700 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white dark:border-neutral-600 dark:text-neutral-300"
                          onClick={() => router.push("/order")}
                        >
                          My Orders
                        </button>
                        <button
                          className="btn btn-ghost w-full text-neutral-700 dark:text-neutral-300"
                          onClick={() => router.push("/account")}
                        >
                          My Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              !isAuthUser && (
                <div className={iconButtonClass}>
                  <ShoppingBagIcon className="h-5 w-5" />
                </div>
              )
            )}

            <DarkModeToggle />

            {user?.role === "admin" && (
              <button
                onClick={handleLinkClick(isAdminView ? "/" : "/admin-view")}
                className={`hidden rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors duration-200 lg:inline-flex ${
                  overDark
                    ? "border-white/40 text-white hover:border-white"
                    : "border-neutral-300 text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-600 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white"
                }`}
              >
                {isAdminView ? "Client View" : "Admin View"}
              </button>
            )}

            {isAuthUser ? (
              <button
                onClick={handleLogout}
                className="hidden rounded-full bg-secondary px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-white transition-colors duration-200 hover:bg-secondary/90 lg:inline-flex"
              >
                Logout
              </button>
            ) : (
              <button
                className={`hidden rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors duration-200 lg:inline-flex ${
                  overDark
                    ? "bg-white text-neutral-900 hover:bg-primary hover:text-white"
                    : "bg-neutral-900 text-white hover:bg-primary dark:bg-white dark:text-neutral-900 dark:hover:bg-primary dark:hover:text-white"
                }`}
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
                  className="swap-off h-6 w-6 fill-current sm:h-8 sm:w-8"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
                </svg>
                <svg
                  className="swap-on h-6 w-6 fill-current sm:h-8 sm:w-8"
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
