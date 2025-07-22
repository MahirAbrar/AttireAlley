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

const Account = () => {
  const { user } = useContext(GlobalContext);
  const [addresses, setAddresses] = useState([]);
  const [addLoading, setAddLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState({});
  const [fetchLoading, setFetchLoading] = useState(true);

  const fetchAddresses = useCallback(async (userID) => {
    const { success, data } = await getAllAddresses(userID);
    console.log("fetching addresses");
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
      setFormData(prevFormData => ({ ...prevFormData, userID: user._id }));
      console.log(user);
    }
  }, [user, fetchAddresses]);

  const updateAddressHandler = (address) => {
    console.log("Update address", address);
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
      {user && <h3>{user.name}</h3>}
      {user && <h3>{user.email}</h3>}
      {user && user.role === "admin" && <h3>Admin</h3>}
      {user && user.role === "customer" && <h3>Customer</h3>}
      <h1 className="font-bold">Your addresses :</h1>
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
