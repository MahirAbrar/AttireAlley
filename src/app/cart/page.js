"use client";
import React, { useEffect, useState } from "react";
import { getCartItems } from "../services/getCartItems";
import { GlobalContext } from "@/context/index";
import { useContext } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import CartItemCard from "@/components/CartItem";

const page = () => {
  const { isAuthUser, user } = useContext(GlobalContext);
  const [cartItems, setCartItems] = useState([]);

  const router = useRouter();
  useEffect(() => {
    if (isAuthUser && user) {
      fetchUserCartItems();
    } else {
      // toast.error("You need to be logged in to view this page");
    }
  }, [user, isAuthUser]);

  const fetchUserCartItems = async () => {
    try {
      const response = await getCartItems(user._id);
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      // Handle error if needed
    }
  };

  return (
    <div>
      <CartItemCard cartItems={cartItems} />
    </div>
  );
};

export default page;
