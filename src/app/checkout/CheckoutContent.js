"use client";
import React, { useState, useEffect, useContext, useCallback } from "react";
import { getAddresses } from "../../services/address";
import { getCartItems } from "../../services/getCartItems";
import { GlobalContext } from "@/context/index";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "@/components/Loader";
import { loadStripe } from "@stripe/stripe-js";
import { callStripeSession } from "../../services/stripe";
import { createNewOrder } from "../../services/order";
import Image from 'next/image';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

const CheckoutContent = () => {
  const { isAuthUser, user } = useContext(GlobalContext);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [_totalItems, setTotalItems] = useState(0);

  const fetchUserCartItems = useCallback(async () => {
    if (!user?._id) return;
    setCartLoading(true);
    try {
      const response = await getCartItems(user._id);
      if (response.success && response.data) {
        const items = Array.isArray(response.data) ? response.data : [];
        setCartItems(items);
        const totalItemCount = items.reduce(
          (total, item) => total + item.quantity,
          0,
        );
        setTotalItems(totalItemCount);
      } else {
        setCartItems([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartItems([]);
      setTotalItems(0);
    } finally {
      setCartLoading(false);
    }
  }, [user]);

  const fetchUserAddresses = useCallback(async () => {
    if (!user?._id) return;
    setAddressLoading(true);
    try {
      const response = await getAddresses(user._id);
      if (response.success && response.data) {
        setAddresses(response.data);
        if (response.data.length === 1) {
          setSelectedAddress(response.data[0]);
        }
      } else {
        setAddresses([]);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setAddresses([]);
    } finally {
      setAddressLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthUser && user) {
      fetchUserCartItems();
      fetchUserAddresses();
    }
  }, [user, isAuthUser, fetchUserCartItems, fetchUserAddresses]);

  const updateOrderPaymentStatus = useCallback(async (sessionId) => {
    try {
      // Find and update the most recent order for this user
      const response = await fetch('/api/order/update-payment-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: user._id,
          sessionId: sessionId
        }),
      });

      if (response.ok) {
        router.push('/order-success?status=success&session_id=' + sessionId);
      } else {
        console.error('Failed to update payment status');
        router.push('/order-success?status=success&session_id=' + sessionId);
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      router.push('/order-success?status=success&session_id=' + sessionId);
    }
  }, [user, router]);

  useEffect(() => {
    const status = searchParams.get('status');
    const sessionId = searchParams.get('session_id');
    
    if (status === 'success' && sessionId && user) {
      // Update the most recent order as paid
      updateOrderPaymentStatus(sessionId);
    }
  }, [searchParams, user, updateOrderPaymentStatus]);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      alert("Please select a shipping address");
      return;
    }

    try {
      const orderData = {
        user: user._id,
        orderItems: cartItems.map(item => ({
          quantity: item.quantity,
          productID: item.productID._id
        })),
        shippingAddress: {
          fullName: selectedAddress.fullName,
          address: selectedAddress.address,
          city: selectedAddress.city,
          country: selectedAddress.country,
          postalCode: selectedAddress.postalCode,
          additionalDetails: selectedAddress.additionalDetails || ""
        },
        paymentMethod: "Stripe",
        totalPrice: cartItems.reduce((total, item) => 
          total + (item.productID.onSale === "Yes" 
            ? (item.productID.price - item.productID.priceDrop) * item.quantity
            : item.productID.price * item.quantity
          ), 0
        ),
        isPaid: false,
        isProcessing: true
      };

      const orderResponse = await createNewOrder(orderData);
      if (!orderResponse.success || !orderResponse.data?._id) {
        throw new Error("Failed to create order or get order ID");
      }

      const stripe = await stripePromise;
      const createLineItems = cartItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.productID.name,
            images: [item.productID.imageURL[0]],
          },
          unit_amount: item.productID.onSale === "Yes" 
            ? (item.productID.price - item.productID.priceDrop) * 100
            : item.productID.price * 100,
        },
        quantity: item.quantity,
      }));

      const res = await callStripeSession({ 
        createLineItems,
        orderId: orderResponse.data._id 
      });
      
      if (!res || !res.id) {
        throw new Error("Failed to create Stripe session");
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: res.id,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex w-full flex-wrap">
      <div className="w-full p-4 md:w-1/2 border border-primary rounded-lg my-4">
        <div className="card rounded-box p-4">
          <h2 className="mb-4 text-xl font-bold">Cart Items</h2>
          <div className="space-y-4">
            {cartLoading && <Loader />}
            {!cartLoading && cartItems && cartItems.length === 0 && (
              <p className="text-gray-500 my-4">Your cart is empty.</p>
            )}
            {cartItems && cartItems.length > 0 && cartItems.map((item) => (
              <div key={item._id} className="flex items-center space-x-2">
                <Image
                  src={item.productID.imageURL[0]}
                  alt={item.productID.name}
                  width={100}
                  height={100}
                  className="h-24 w-24 object-cover"
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
        <div className="card rounded-box border border-primary p-4">
          <h2 className="text-xl font-bold">Addresses</h2>
          <h2 className="text-md mb-4 font-semibold">
            Please select a shipping address.
          </h2>

          {addressLoading && <Loader />}
          {!addressLoading && addresses && addresses.length === 0 && (
            <p className="text-gray-500 my-4">No addresses found. Please add an address in your account settings.</p>
          )}
          {addresses && addresses.length > 0 && addresses.map((address) => (
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
                      ? "bg-primary text-white shadow-md hover:brightness-90 active:brightness-75"
                      : "hover:brightness-90 active:brightness-75 bg-primary text-white shadow-md hover:shadow-lg active:shadow-inner"
                  }
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
                  transform hover:-translate-y-0.5 active:translate-y-0
                `}
                onClick={() => handleAddressSelect(address)}
              >
                {selectedAddress?._id === address._id ? "Selected" : "Select this address"}
              </button>
            </div>
          ))}
          <button
            className="hover:brightness-90 active:brightness-75 mt-2 w-fit transform rounded bg-secondary px-4 py-2 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 active:translate-y-0 active:shadow-inner dark:text-text"
            onClick={() => router.push('/account')}
          >
            Add an Address
          </button>

          <div className="divider"></div>
          <div className="flex justify-between">
            <h3>Subtotal:</h3>
            <h3 className="font-bold">
              $
              {cartItems && cartItems.length > 0 ? cartItems.reduce(
                (acc, item) =>
                  acc +
                  (item.productID.onSale === "Yes"
                    ? (item.productID.price - item.productID.priceDrop) * item.quantity
                    : item.productID.price * item.quantity),
                0
              ) : 0}
            </h3>
          </div>
          <div className="flex justify-between">
            <h3>Shipping:</h3>
            <h3 className="font-bold">Free</h3>
          </div>
          <div className="mb-2 flex justify-between">
            <h3>Total:</h3>
            <h3 className="font-bold">
              {cartItems && cartItems.length > 0 ? cartItems.reduce(
                (acc, item) =>
                  acc +
                  (item.productID.onSale === "Yes"
                    ? (item.productID.price - item.productID.priceDrop) * item.quantity
                    : item.productID.price * item.quantity),
                0
              ) : 0}
            </h3>
          </div>
          <button
            className={`
              mt-2 rounded px-4 py-2 font-semibold transition duration-300 ease-in-out
              ${
                !selectedAddress || cartItems.length === 0
                  ? "cursor-not-allowed bg-gray-300 text-gray-500"
                  : "hover:brightness-90 bg-secondary text-white shadow-lg hover:shadow-xl active:scale-95 active:transform"
              }
              focus:outline-none
              focus:ring-2 focus:ring-secondary focus:ring-opacity-50 dark:text-text
            `}
            disabled={!selectedAddress || cartItems.length === 0}
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutContent; 