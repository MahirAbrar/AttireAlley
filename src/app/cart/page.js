"use client";
import React, { useEffect, useState, useContext, useCallback } from "react";
import { getCartItems } from "../../services/getCartItems";
import { GlobalContext } from "@/context/index";
import { useRouter } from "next/navigation";
import CartItemCard from "@/components/CartItem";
import { deleteCartItem } from "@/services/deleteCartItem";
import NeonButton from "@/components/NeonButton";

const Cart = () => {
  const { isAuthUser, user, triggerNavbarUpdate } = useContext(GlobalContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const router = useRouter();

  const handleCheckout = () => {
    router.push("/checkout");
  };

  const fetchUserCartItems = useCallback(async () => {
    if (!user?._id) return;
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
  }, [user]);

  useEffect(() => {
    if (isAuthUser && user) {
      fetchUserCartItems();
    } else {
      // toast.error("You need to be logged in to view this page");
    }
  }, [user, isAuthUser, fetchUserCartItems]);

  const handleDelete = (item) => {
    deleteCartItem(user._id, item.productID._id)
      .then((response) => {
        if (response.success) {
          // Update the cart items after successful deletion
          fetchUserCartItems();
          triggerNavbarUpdate();
          // You can show a toast message here
        } else {
          console.error("Error deleting item", response.message);
          // You can show a toast message here
        }
      })
      .catch((error) => {
        console.error("Error deleting item", error);
        // You can show a toast message here
      });
  };

  return (
    <div className="container mx-auto  border-x-2   border-accent border-opacity-5 p-4 shadow-lg dark:border-accentDark  dark:border-opacity-5">
      <div className="mb-4 flex flex-col items-center justify-between md:flex-row">
        <h1 className="mb-4 text-2xl font-bold md:mb-0">Cart Items</h1>
        <div className="flex items-center">
          <div className="mr-4">Total Items: {totalItems}</div>
          <NeonButton
            className=""
            onClick={handleCheckout}
          >
            Continue to Checkout
          </NeonButton>
        </div>
      </div>
      <div className="mb-4">
        <CartItemCard cartItems={cartItems} handleDelete={handleDelete} />
      </div>
      <div className="flex justify-end">
        <NeonButton
          className=""
          onClick={handleCheckout}
        >
          Continue to Checkout
        </NeonButton>
      </div>
    </div>
  );
};

export default Cart;
