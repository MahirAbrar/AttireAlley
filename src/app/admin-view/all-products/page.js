import React from "react";
import CommonListing from "@/components/CommonListing";
// {
// user: "",
//       name: "",
//       description: "",
//       price: 0,
//       category: "Men",
//       sizes: [],
//       deliveryInfo: "",
//       onSale: "No",
//       imageURL: "",
//       priceDrop: 0,
// }

const allProducts = () => {
  return (
    <div className=" flex flex-wrap justify-center p-6">
      <CommonListing />
    </div>
  );
};

export default allProducts;
