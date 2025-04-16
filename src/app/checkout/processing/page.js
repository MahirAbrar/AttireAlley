"use client";
import React from "react";
import Loader from "@/components/Loader";

const ProcessingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        <Loader />
        <h1 className="text-2xl font-bold mt-4">Processing Your Order</h1>
        <p className="text-gray-600 mt-2">Please wait while we process your payment...</p>
      </div>
    </div>
  );
};

export default ProcessingPage; 