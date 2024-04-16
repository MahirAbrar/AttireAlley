"use client";
import React from "react";

const Page = ({ params }) => {
  return (
    <div>
      <h1>Product Details: {params.details}</h1>
      {/* Add your code to display the product details here */}
    </div>
  );
};

export default Page;

// Name this page
// [details] -> page.js
// now params will contain the details
