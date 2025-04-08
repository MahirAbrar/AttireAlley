"use client";
// Disable adblock of any sort to make stripe work
import React, { useState, useEffect } from "react";
import { getAllAddresses } from "../../services/address";
import { getCartItems } from "../../services/getCartItems";
import { GlobalContext } from "@/context/index";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { loadStripe } from "@stripe/stripe-js";
import { callStripeSession } from "../../services/stripe";
import { set } from "mongoose";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

const Checkout = () => {
  const { isAuthUser, user } = useContext(GlobalContext);
  const router = useRouter();

  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);

  const [isOrderProcessing, setIsOrderProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

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

  const handleCheckout = async () => {
    const stripe = await stripePromise;

    const createLineItems = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.productID.name,
          images: [item.productID.imageURL[0]],
        },
        unit_amount: item.productID.price * 100,
      },
      quantity: item.quantity,
    }));

    console.log("Line items:", createLineItems);
    const res = await callStripeSession({ createLineItems });
    console.log("Stripe session response:", res); // Add this log

    setIsOrderProcessing(true);

    if (!res || !res.id) {
      console.error("Invalid response from Stripe session creation:", res);
      return;
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId: res.id,
    });

    if (error) {
      console.error("Stripe redirect error:", error);
      setIsOrderProcessing(false);
    }
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
                className={`
    mt-2 rounded px-4 py-2 font-semibold transition-all duration-300 ease-in-out
    ${
      selectedAddress?._id === address._id
        ? "bg-green-500 text-white shadow-md hover:bg-green-600 active:bg-green-700"
        : "hover:bg-primary-dark active:bg-primary-darker bg-primary text-white shadow-md hover:shadow-lg active:shadow-inner"
    }
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${
      selectedAddress?._id === address._id
        ? "focus:ring-green-500"
        : "focus:ring-primary"
    }
    transform hover:-translate-y-0.5 active:translate-y-0
  `}
                onClick={() => handleAddressSelect(address)}
              >
                {selectedAddress?._id === address._id ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="mr-2 h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Selected
                  </span>
                ) : (
                  "Select this address"
                )}
              </button>
            </div>
          ))}
          <button
            className="hover:bg-secondary-dark active:bg-secondary-darker mt-2 w-fit transform rounded bg-secondary px-4 py-2 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 active:translate-y-0 active:shadow-inner dark:text-text"
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
          <div className="mb-2 flex justify-between">
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
            className={`
    mt-2 rounded px-4 py-2 font-semibold transition duration-300 ease-in-out
    ${
      !selectedAddress || cartItems.length === 0
        ? "cursor-not-allowed bg-gray-400 text-gray-600"
        : "hover:bg-secondary-dark bg-secondary text-white shadow-lg hover:shadow-xl active:scale-95 active:transform"
    }
    focus:outline-none
    focus:ring-2 focus:ring-secondary focus:ring-opacity-50 dark:text-text
  `}
            disabled={!selectedAddress || cartItems.length === 0}
            onClick={() => handleCheckout()}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

//add address button which navigates to account page
