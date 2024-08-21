"use client";
import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/context/index";

import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import LoaderBig from "@/components/LoaderBig";

const AdminView = () => {
  const router = useRouter();
  const { isAuthUser, user } = useContext(GlobalContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthUser !== null) {
      // Ensures this runs only after isAuthUser is set
      if (!isAuthUser || user?.role !== "admin") {
        // User is not authenticated or not an admin
        router.push("/some-other-route"); // Redirect them elsewhere
      } else {
        setLoading(false); // User is authenticated and is an admin, proceed to show the page
      }
    }
  }, [isAuthUser, user]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background dark:bg-backgroundDark">
        <LoaderBig />
      </div>
    );
  }

  return <div>Admin Page</div>;
};

export default AdminView;
