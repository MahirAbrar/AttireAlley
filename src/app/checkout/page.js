"use client";

import React, { useState, useEffect } from "react";
import { getAllAddresses } from "../services/address";
import { getCartItems } from "../services/getCartItems";
import { GlobalContext } from "@/context/index";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

const page = () => {
  const { isAuthUser, user } = useContext(GlobalContext);
  const router = useRouter();

  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);

  const fetchUserCartItems = async () => {
    setCartLoading(true);
    try {
      const response = await getCartItems(user._id);
      setCartItems(response.data);

      // Calculate the total number of items
      const totalItemCount = response.data.reduce(
        (total, item) => total + item.quantity,
        0,
      );
      setTotalItems(totalItemCount);
      setCartLoading(false);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      // Handle error if needed
      setCartLoading(false);
    }
  };

  const fetchUserAddresses = async () => {
    setAddressLoading(true);
    try {
      const response = await getAllAddresses(user._id);
      if (response.success) {
        setAddresses(response.data.data);
        setAddressLoading(false);
      } else {
        console.error("Error fetching addresses:", response.message);
        // Handle error if needed
        setAddressLoading(false);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      // Handle error if needed
      setAddressLoading(false);
    }
  };

  const handleAddAddressClick = () => {
    router.push("/account");
  };

  useEffect(() => {
    if (isAuthUser && user) {
      fetchUserCartItems();
      fetchUserAddresses();
    } else {
      // toast.error("You need to be logged in to view this page");
    }
  }, [user, isAuthUser]);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  return (
    <div className="flex w-full flex-wrap">
      <div className="w-full p-4 md:w-1/2">
        <div className="card rounded-box bg-base-300 p-4">
          <h2 className="mb-4 text-xl font-bold">Cart Items</h2>
          <div className="space-y-4">
            {cartLoading && <Loader />}
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center space-x-2">
                <img
                  src={item.productID.imageURL[0]}
                  alt={item.productID.name}
                  className="h-20 w-20 rounded object-cover"
                />
                <div>
                  <p className="font-bold">{item.productID.name}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>
                    Price: $
                    {item.productID.onSale === "Yes"
                      ? item.productID.price - item.productID.priceDrop
                      : item.productID.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full p-4 md:w-1/2">
        <div className="card rounded-box bg-base-300 p-4">
          <h2 className=" text-xl font-bold">Addresses</h2>
          <h2 className="text-md mb-4 font-semibold">
            Please select a shipping address.
          </h2>

          {addressLoading && <Loader />}
          {addresses.map((address) => (
            <div
              key={address._id}
              className={`mb-4 rounded border p-4 ${
                selectedAddress?._id === address._id
                  ? "bg-primary-focus border-2 border-primary"
                  : "border-gray-300"
              }`}
            >
              <p>
                <strong>Full Name:</strong> {address.fullName}
              </p>
              <p>
                <strong>Address:</strong> {address.address}
              </p>
              <p>
                <strong>City:</strong> {address.city}
              </p>
              <p>
                <strong>Country:</strong> {address.country}
              </p>
              <p>
                <strong>Postal Code:</strong> {address.postalCode}
              </p>
              <p>
                <strong>Additional Details:</strong> {address.additionalDetails}
              </p>
              <button
                className="mt-2 rounded bg-primary px-4 py-2 text-white"
                onClick={() => handleAddressSelect(address)}
              >
                {selectedAddress?._id === address._id
                  ? "Selected"
                  : "Select this address"}
              </button>
            </div>
          ))}
          <button
            className="mt-2 w-fit rounded bg-secondary px-4 py-2 dark:text-text"
            onClick={handleAddAddressClick}
          >
            Add an Address
          </button>

          <div className="divider"></div>
          <div className="flex justify-between">
            <h3>Subtotal:</h3>
            <h3 className="font-bold">
              $
              {cartItems.reduce(
                (acc, item) =>
                  acc +
                  (item.productID.price - item.productID.priceDrop) *
                    item.quantity,
                0,
              )}
            </h3>
          </div>
          <div className="flex justify-between">
            <h3>Shipping:</h3>
            <h3 className="font-bold">Free</h3>
          </div>
          <div className="flex justify-between">
            <h3>Total:</h3>
            <h3 className="font-bold">
              {cartItems.reduce(
                (acc, item) =>
                  acc +
                  (item.productID.price - item.productID.priceDrop) *
                    item.quantity,
                0,
              )}
            </h3>
          </div>
          <button
            className="mt-2 rounded bg-secondary px-4 py-2 dark:text-text"
            disabled={!selectedAddress || cartItems.length === 0}
            onClick={() => console.log("Checkout button clicked")}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;

//add address button which navigates to account page
