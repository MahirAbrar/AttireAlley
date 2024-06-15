"use client";

import React from "react";
import { useState, useEffect } from "react";
import { getAllAddresses } from "../services/address";
import { GlobalContext } from "@/context";
import { useContext } from "react";

const page = () => {
  const { user } = useContext(GlobalContext);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addresses, setAddresses] = useState([]);

  const fetchAddresses = async (userID) => {
    const { success, data } = await getAllAddresses(userID);
    if (success) {
      setAddresses(data.data);
    }
  };

  useEffect(() => {
    // check if user exists
    let userExist = user ? true : false;
    if (userExist) {
      fetchAddresses(user._id);
    }
  }, [user]);

  const handleShowAddressForm = () => {
    setShowAddressForm(!showAddressForm);
  };

  console.log(addresses);
  return (
    <div className="container  mx-4  border-2  border-accent border-opacity-5 px-4 shadow-lg dark:border-accentDark  dark:border-opacity-5">
      <div className="px-6 py-8">
        <div className=" ">
          <h3>Mahir</h3>
          <h3>hamid.mahir2597@Yahoo.com</h3>
          <h3>Admin</h3>
          <button className="btn my-2">View your orders</button>
          <h1 className="font-bold">Your addresses :</h1>
          {addresses.map((address) => (
            <div
              key={address._id}
              className="my-2 border-2  border-accent border-opacity-5 shadow-sm dark:border-accentDark  dark:border-opacity-5"
            >
              <h3>Full name: {address.fullName}</h3>
              <h3>Address: {address.address}</h3>
              <h3>City: {address.city}</h3>
              <h3>Country: {address.country}</h3>
              <h3>Postal Code: {address.postalCode}</h3>
              <h3>Additional Details: {address.additionalDetails}</h3>
            </div>
          ))}
        </div>
        <button className="btn mt-2" onClick={handleShowAddressForm}>
          {!showAddressForm ? "Show Address Form" : "Hide Address Form"}
        </button>
        {showAddressForm && (
          <div>
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-textDark"
              >
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="dark:placeholder-gray-text block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 focus:border-primary focus:ring-primary sm:text-sm dark:border-gray-600 dark:bg-accentDark dark:text-textDark dark:placeholder:text-text dark:focus:border-primary dark:focus:ring-primary"
                placeholder="John Doe"
                required=""
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-textDark"
              >
                Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 focus:border-primary focus:ring-primary sm:text-sm dark:border-gray-600 dark:bg-accentDark dark:text-textDark dark:placeholder-text dark:focus:border-primary dark:focus:ring-primary"
                placeholder="name@company.com"
                required=""
              />
            </div>
            <div>
              <label
                htmlFor="city"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-textDark"
              >
                City
              </label>
              <input
                type="text"
                name="city"
                id="city"
                placeholder="Enter your Password"
                className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 focus:border-primary focus:ring-primary sm:text-sm dark:border-gray-600 dark:bg-accentDark dark:text-textDark dark:placeholder-text dark:focus:border-primary dark:focus:ring-primary"
                required=""
              />
            </div>
            <div>
              <label
                htmlFor="country"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-textDark"
              >
                Country
              </label>
              <input
                type="text"
                name="country"
                id="country"
                placeholder="Confirm your Password"
                className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 focus:border-primary focus:ring-primary sm:text-sm dark:border-gray-600 dark:bg-accentDark dark:text-textDark dark:placeholder-text dark:focus:border-primary dark:focus:ring-primary"
                required=""
              />
            </div>
            <div>
              <label
                htmlFor="postcode"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-textDark"
              >
                Postal Code
              </label>
              <input
                type="number"
                name="postcode"
                id="postcode"
                placeholder="Confirm your Password"
                className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 focus:border-primary focus:ring-primary sm:text-sm dark:border-gray-600 dark:bg-accentDark dark:text-textDark dark:placeholder-text dark:focus:border-primary dark:focus:ring-primary"
                required=""
              />
            </div>
            <div>
              <label
                htmlFor="additional-details"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-textDark"
              >
                Additional Details
              </label>
              <input
                type="text"
                name="additional-details"
                id="additional-details"
                placeholder="Additional details - first floor, 2 on the lift, etc"
                className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 focus:border-primary focus:ring-primary sm:text-sm dark:border-gray-600 dark:bg-accentDark dark:text-textDark dark:placeholder-text dark:focus:border-primary dark:focus:ring-primary"
                required=""
              />
            </div>
            <button className="btn">Add Address</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
