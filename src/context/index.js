"use client";
import Cookies from "js-cookie";
import "../app/globals.css";

import { createContext, useEffect, useState } from "react";

export const GlobalContext = createContext(null);

export default function GlobalState({ children }) {
  const [showNavModal, setShowNavModal] = useState(false);
  // Is used logged in?
  const [isAuthUser, setIsAuthUser] = useState(null);
  const [user, setUser] = useState(null);
  // loaders
  const [componentLoader, setComponentLoader] = useState({
    loading: false,
    id: "",
  });
  const [pageLoader, setPageLoader] = useState(false);
  const [updateItem, setUpdateItem] = useState(null);
  const [cartitemsCount, setCartItemsCount] = useState(0);
  const [navbarUpdateTrigger, setNavbarUpdateTrigger] = useState(0);
  const [isDark, setIsDark] = useState(false);

  // Updates the cart in the navbar
  const triggerNavbarUpdate = () => {
    setNavbarUpdateTrigger((prevTrigger) => (prevTrigger + 1) % 11);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('isDark');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialDarkMode = saved !== null ? JSON.parse(saved) : prefersDark;
      
      setIsDark(initialDarkMode);
      if (initialDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isDark', JSON.stringify(isDark));
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDark]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        if (localStorage.getItem('isDark') === null) {
          setIsDark(e.matches);
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setIsAuthUser(true);
      setUser(JSON.parse(user));
    } else {
      setIsAuthUser(false);
      setUser(null);
      localStorage.removeItem("user");
    }
  }, [setIsAuthUser, setUser]);

  return (
    <GlobalContext.Provider
      value={{
        showNavModal,
        setShowNavModal,
        isAuthUser,
        setIsAuthUser,
        user,
        setUser,
        componentLoader,
        setComponentLoader,
        pageLoader,
        setPageLoader,
        updateItem,
        setUpdateItem,
        cartitemsCount,
        setCartItemsCount,
        navbarUpdateTrigger,
        triggerNavbarUpdate,
        isDark,
        setIsDark,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
