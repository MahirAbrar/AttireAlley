import Cookies from "js-cookie";

// Frontend service function to add a new address
export const addAddress = async (data) => {
  const formData = {
    userID: data.userID,
    fullName: data.fullName,
    address: data.address,
    city: data.city,
    country: data.country,
    postalCode: data.postalCode,
    additionalDetails: data.additionalDetails,
  };
  console.log("formData is ", formData);
  try {
    const response = await fetch("/api/address/add-new-address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message:
          data.message ||
          "Network response was not ok from add address service",
      };
    }
    return { success: true, data };
  } catch (e) {
    console.log("Error in add address service", e);
    return { success: false, message: e.message };
  }
};

// Frontend service function to delete an address
export const deleteAddress = async (userID, addressID) => {
  console.log("DELETEING ADDRESWS");
  console.log(userID, addressID);
  try {
    const response = await fetch(
      `/api/address/delete-address?userID=${userID}&addressID=${addressID}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      },
    );
    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message:
          data.message ||
          "Network response was not ok from delete address service",
      };
    }
    return { success: true, data };
  } catch (e) {
    return { success: false, message: e.message };
  }
};

// Frontend service function to update an address
export const updateAddress = async (data) => {
  const formData = {
    userID: data.userID,
    addressID: data.addressID,
    fullName: data.fullName,
    address: data.address,
    city: data.city,
    country: data.country,
    postalCode: data.postalCode,
    additionalDetails: data.additionalDetails,
  };
  console.log("formData is ", formData);
  try {
    const response = await fetch("/api/address/update-address", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message:
          data.message ||
          "Network response was not ok from update address service",
      };
    }
    return { success: true, data };
  } catch (e) {
    console.log("Error in update address service", e);
    return { success: false, message: e.message };
  }
};

// Frontend service function to get all addresses for a user
export const getAllAddresses = async (userID) => {
  try {
    const response = await fetch(
      `/api/address/get-all-address?userID=${userID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      },
    );
    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message:
          data.message ||
          "Network response was not ok from get all addresses service",
      };
    }
    return { success: true, data };
  } catch (e) {
    console.log("Error in get all addresses service", e);
    return { success: false, message: e.message };
  }
};
