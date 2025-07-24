"use client";

import React from "react";
import { useState, useEffect, useCallback } from "react";
import { GlobalContext } from "@/context";
import { useContext } from "react";
import {
  updateAddress,
  deleteAddress,
  addAddress,
  getAllAddresses,
} from "../../services/address";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import Link from "next/link";

const Account = () => {
  const { user } = useContext(GlobalContext);
  const [addresses, setAddresses] = useState([]);
  const [addLoading, setAddLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState({});
  const [fetchLoading, setFetchLoading] = useState(true);

  const fetchAddresses = useCallback(async (userID) => {
    const { success, data } = await getAllAddresses(userID);
    if (success) {
      setAddresses(data.data);
    }
    setFetchLoading(false);
  }, []);

  useEffect(() => {
    // check if user exists
    let userExist = user ? true : false;
    if (userExist) {
      fetchAddresses(user._id);
      setFormData((prevFormData) => ({ ...prevFormData, userID: user._id }));
    }
  }, [user, fetchAddresses]);

  const updateAddressHandler = (address) => {
    };

  const deleteAddressHandler = (address) => {
    setDeleteLoading((prevState) => ({ ...prevState, [address._id]: true }));
    deleteAddress(address.userID, address._id)
      .then(() => {
        toast.success("Address deleted successfully");
        fetchAddresses(user._id);
        setDeleteLoading((prevState) => ({
          ...prevState,
          [address._id]: false,
        }));
      })
      .catch((e) => {
        toast.error("Error deleting address");
        setDeleteLoading((prevState) => ({
          ...prevState,
          [address._id]: false,
        }));
      });
  };

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    additionalDetails: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAddLoading(true);
    addAddress(formData).then((res) => {
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      fetchAddresses(user._id);
      setAddLoading(false);
    });
  };

  return (
    <div className="dark:border-primaryDark dark:shadow-primaryDark/30 container mx-4 my-4 rounded-lg border-2 border-primary border-opacity-50 bg-opacity-50 px-8 py-8 text-lg shadow-lg shadow-primary/30 dark:border-opacity-50">
      {/* Quick Navigation Shortcuts */}
      <div className="mb-6 flex flex-wrap gap-4">
        <Link href="/cart" className="btn btn-outline btn-primary btn-sm">
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          View Cart
        </Link>
        <Link href="/orders" className="btn btn-outline btn-primary btn-sm">
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          My Orders
        </Link>
        <Link href="/products" className="btn btn-outline btn-primary btn-sm">
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          Shop Products
        </Link>
      </div>

      <div className="divider"></div>

      {/* User Info */}
      <div className="mb-6">
        {user && <h3 className="text-2xl font-bold">{user.name}</h3>}
        {user && (
          <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
        )}
        {user && user.role === "admin" && (
          <span className="badge badge-warning">Admin</span>
        )}
        {user && user.role === "customer" && (
          <span className="badge badge-primary">Customer</span>
        )}
      </div>

      <h1 className="mb-4 text-xl font-bold">Your addresses:</h1>
      {fetchLoading ? (
        <Loader />
      ) : (
        addresses.length === 0 && <h3>No addresses found.</h3>
      )}

      {addresses.map((address) => (
        <div
          key={address._id}
          className="dark:border-accentDark my-2  border-2 border-accent border-opacity-5 shadow-sm  dark:border-opacity-5"
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
              className="btn btn-warning"
              onClick={() => deleteAddressHandler(address)}
              disabled={deleteLoading[address._id]}
            >
              Delete {deleteLoading[address._id] ? <Loader /> : ""}
            </button>
          </div>
        </div>
      ))}
      <div className="divider divider-primary"></div>

      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="fullName"
              className="mb-2 block text-sm font-medium  "
            >
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={formData.name}
              onChange={handleChange}
              className="dark:placeholder-gray-text dark:bg-accentDark dark:placeholder:text-text block w-full rounded-lg border border-gray-300  bg-white p-2.5 focus:border-primary focus:ring-primary dark:border-gray-600  dark:focus:border-primary dark:focus:ring-primary sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="address"
              className="mb-2 block text-sm font-medium "
            >
              Address
            </label>
            <input
              type="text"
              name="address"
              id="address"
              value={formData.address}
              onChange={handleChange}
              className="dark:bg-accentDark dark:placeholder-text block w-full rounded-lg border border-gray-300  bg-white p-2.5 focus:border-primary focus:ring-primary dark:border-gray-600  dark:focus:border-primary dark:focus:ring-primary sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="city" className="mb-2 block text-sm font-medium  ">
              City
            </label>
            <input
              type="text"
              name="city"
              id="city"
              value={formData.city}
              onChange={handleChange}
              className="dark:bg-accentDark dark:placeholder-text block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 focus:border-primary focus:ring-primary dark:border-gray-600  dark:focus:border-primary dark:focus:ring-primary sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="country"
              className="mb-2 block text-sm font-medium  "
            >
              Country
            </label>
            <input
              type="text"
              name="country"
              id="country"
              value={formData.country}
              onChange={handleChange}
              className="dark:bg-accentDark dark:placeholder-text block w-full rounded-lg border border-gray-300  bg-white p-2.5 focus:border-primary focus:ring-primary dark:border-gray-600  dark:focus:border-primary dark:focus:ring-primary sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="postcode"
              className="mb-2 block text-sm font-medium  "
            >
              Postal Code
            </label>
            <input
              type="number"
              name="postalCode"
              id="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className="dark:bg-accentDark dark:placeholder-text block w-full rounded-lg border border-gray-300  bg-white p-2.5 focus:border-primary focus:ring-primary dark:border-gray-600  dark:focus:border-primary dark:focus:ring-primary sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="additionalDetails"
              className="mb-2 block text-sm font-medium  "
            >
              Additional Details
            </label>
            <input
              type="text"
              name="additionalDetails"
              id="additionalDetails"
              value={formData.additionalDetails}
              onChange={handleChange}
              placeholder="Additional details - first floor, 2 on the lift, etc"
              className="dark:bg-accentDark dark:text-textDark dark:placeholder-text block w-full rounded-lg border  border-gray-300 bg-white p-2.5 focus:border-primary focus:ring-primary dark:border-gray-600 dark:focus:border-primary dark:focus:ring-primary sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="dark:btn-primaryDark btn btn-primary mt-4 text-lg"
          >
            Add Address {addLoading ? <Loader /> : ""}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Account;
