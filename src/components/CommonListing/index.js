import React from "react";

const CommonListing = () => {
  return (
    <div className="mx-3 my-4 min-w-[360px] max-w-sm bg-base-100 shadow-xl  ">
      <figure>
        <img
          src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
          alt="Shoes"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          Name of Item
          <div className="badge badge-secondary">Sale</div>
        </h2>
        <h3>$30</h3>
        <div className="card-actions justify-end">
          <div className="badge badge-outline">Category (Men)</div>
        </div>
      </div>
    </div>
  );
};

export default CommonListing;
