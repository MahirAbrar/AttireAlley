"use client";

import React from "react";
import { useState, useEffect } from "react";
import { getAllAddresses } from "../services/address";
import { GlobalContext } from "@/context";
import { useContext } from "react";
import { updateAddress, deleteAddress } from "../services/address";
import { toast } from "react-toastify";

const page = () => {
  const { user } = useContext(GlobalContext);
  const [addresses, setAddresses] = useState([]);

  const fetchAddresses = async (userID) => {
    const { success, data } = await getAllAddresses(userID);
    if (success) {
      setAddresses(data.data);
      console.log("fetched");
    }
  };

  useEffect(() => {
    // check if user exists
    let userExist = user ? true : false;
    if (userExist) {
      fetchAddresses(user._id);
    }
  }, [user]);

  const updateAddressHandler = (address) => {
    console.log("Update address", address);
  };

  const deleteAddressHandler = (address) => {
    deleteAddress(address.userID, address._id);
    toast.success("Address deleted successfully");
    fetchAddresses(user._id);
  };

  return (
    <div className="container  mx-4  border-2 border-accent border-opacity-5 bg-base-100 bg-opacity-50 px-8 py-8 shadow-lg dark:border-accentDark  dark:border-opacity-5">
      <h3>Mahir</h3>
      <h3>hamid.mahir2597@Yahoo.com</h3>
      <h3>Admin</h3>
      <button className="btn my-2">View your orders</button>
      <h1 className="font-bold">Your addresses :</h1>
      {addresses.length === 0 && <h3>No addresses found.</h3>}
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
          <div className="mt-2 flex gap-2">
            <button
              className="btn btn-primary "
              onClick={() => updateAddressHandler(address)}
            >
              Update
            </button>
            <button
              className="btn btn-warning  "
              onClick={() => deleteAddressHandler(address)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      <div className="divider divider-primary"></div>

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
        <button className="dark:btn-primaryDark btn btn-primary mt-4">
          Add Address
        </button>
      </div>
    </div>
  );
};

export default page;
