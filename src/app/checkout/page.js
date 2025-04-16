"use client";
// Disable adblock of any sort to make stripe work
import React, { useState, useEffect, Suspense } from "react";
import { getAllAddresses } from "../../services/address";
import { getCartItems } from "../../services/getCartItems";
import { GlobalContext } from "@/context/index";
import { useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "@/components/Loader";
import { loadStripe } from "@stripe/stripe-js";
import { callStripeSession } from "../../services/stripe";
import { createNewOrder } from "../../services/order";
import Image from 'next/image';
import CheckoutContent from './CheckoutContent';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

export default function Checkout() {
  return (
    <Suspense fallback={<Loader />}>
      <CheckoutContent />
    </Suspense>
  );
}

//add address button which navigates to account page
