"use client";
import "../app/globals.css";

import { createContext, useState } from "react";

export const GlobalContext = createContext(null);

export default function GlobalState({ children }) {
  const [showNavModal, setShowNavModal] = useState(false);
  const [isAuthUser, setFormState] = useState(null);
  const [user, setUser] = useState(null);

  return (
    <GlobalContext.Provider
      value={{
        showNavModal,
        setShowNavModal,
        isAuthUser,
        setFormState,
        user,
        setUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
