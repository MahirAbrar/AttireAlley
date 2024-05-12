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
  const [totalItems, setTotalItems] = useState(0);
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

      // Calculate the total number of items
      const totalItemCount = response.data.reduce(
        (total, item) => total + item.quantity,
        0,
      );
      setTotalItems(totalItemCount);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      // Handle error if needed
    }
  };

  console.log(user);
  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex flex-col items-center justify-between md:flex-row">
        <h1 className="mb-4 text-2xl font-bold md:mb-0">Cart Items</h1>
        <div className="flex items-center">
          <div className="mr-4">Total Items: {totalItems}</div>
          <button className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
            Continue to Checkout
          </button>
        </div>
      </div>
      <div className="mb-4">
        <CartItemCard cartItems={cartItems} />
      </div>
      <div className="flex justify-end">
        <button className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          Continue to Checkout
        </button>
      </div>
    </div>
  );
};

export default page;
