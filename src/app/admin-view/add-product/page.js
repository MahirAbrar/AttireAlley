"use client";
import React, { useState } from "react";

const addProduct = () => {
  const [selectedSize, setSelectedSize] = useState("S");

  return (
    <div className="card w-full max-w-sm shrink-0 bg-base-100 p-4 shadow-2xl">
      <label className="form-control w-full">
        <input type="file" className="file-input w-full max-w-xs" />
      </label>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Available Sizes</span>
        </div>
        <ul className="menu  menu-horizontal rounded-box bg-base-200">
          <li>
            <a
              className={selectedSize === "S" ? "active" : ""}
              onClick={() => setSelectedSize("S")}
            >
              S
            </a>
          </li>
          <li>
            <a
              className={selectedSize === "M" ? "active" : ""}
              onClick={() => setSelectedSize("M")}
            >
              M
            </a>
          </li>
          <li>
            <a
              className={selectedSize === "L" ? "active" : ""}
              onClick={() => setSelectedSize("L")}
            >
              L
            </a>
          </li>
        </ul>
      </label>
      <label className="form-control w-full ">
        <div className="label">
          <span className="label-text">Name of Product</span>
        </div>
        <input
          type="text"
          placeholder="Enter name"
          className="input input-bordered w-full "
        />
      </label>
      <label className="form-control w-full ">
        <div className="label">
          <span className="label-text">Price of Product</span>
        </div>
        <input
          type="number"
          placeholder="Enter price"
          className="input input-bordered w-full "
        />
      </label>
      <label className="form-control w-full ">
        <div className="label">
          <span className="label-text">Description of Product</span>
        </div>
        <input
          type="text"
          placeholder="Enter description"
          className="input input-bordered w-full "
        />
      </label>
      <label className="form-control w-full ">
        <div className="label">
          <span className="label-text">Category</span>
        </div>
        <select className="select select-bordered">
          <option selected>Men</option>
          <option>Women</option>
          <option>Kids</option>
        </select>
      </label>
      <label className="form-control w-full ">
        <div className="label">
          <span className="label-text">Delivery Info</span>
        </div>
        <input
          type="text"
          placeholder="Enter delivery info"
          className="input input-bordered w-full "
        />
      </label>
      <label className="form-control w-full ">
        <div className="label">
          <span className="label-text">On Sale</span>
        </div>
        <select className="select select-bordered">
          <option selected>Yes</option>
          <option>No</option>
        </select>
      </label>

      <label className="form-control w-full ">
        <div className="label">
          <span className="label-text">Price Drop</span>
        </div>
        <input
          type="number"
          placeholder="Enter Price Drop"
          className="input input-bordered w-full "
        />
      </label>
      <button className="btn mt-2 w-full">Add Product</button>
    </div>
  );
};

export default addProduct;
