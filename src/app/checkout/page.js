"use client";

import React, { useState, useEffect } from "react";
import { getAllAddresses } from "../services/address";
import { getCartItems } from "../services/getCartItems";
import { GlobalContext } from "@/context/index";
import { useContext } from "react";

const page = () => {
  const { isAuthUser, user } = useContext(GlobalContext);

  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

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

  const fetchUserAddresses = async () => {
    try {
      const response = await getAllAddresses(user._id);
      setAddresses(response.data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      // Handle error if needed
    }
  };

  useEffect(() => {
    if (isAuthUser && user) {
      fetchUserCartItems();
      fetchUserAddresses();
    } else {
      // toast.error("You need to be logged in to view this page");
    }
  }, [user, isAuthUser]);

  console.log("cartItems", cartItems);
  console.log("addresses", addresses);
  console.log("totalItems", totalItems);

  return (
    <div className="flex w-full p-8">
      <div className="card grid h-20 flex-grow place-items-center rounded-box bg-base-300">
        content
      </div>
      <div className="divider divider-horizontal">OR</div>
      <div className="card grid h-20 flex-grow place-items-center rounded-box bg-base-300">
        content
      </div>
    </div>
  );
};

export default page;

//get cart items

//
