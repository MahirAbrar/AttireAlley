"use client";
// Disable adblock of any sort to make stripe work
import React, { Suspense } from "react";
import Loader from "@/components/Loader";
import CheckoutContent from './CheckoutContent';

export default function Checkout() {
  return (
    <Suspense fallback={<Loader />}>
      <CheckoutContent />
    </Suspense>
  );
}

//add address button which navigates to account page