import { fetchWithAuth } from "@/utils/fetchWithAuth";

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
  const result = await fetchWithAuth("/api/address/add-new-address", {
    method: "POST",
    body: JSON.stringify(formData),
  });
  
  return result;
};

// Frontend service function to delete an address
export const deleteAddress = async (userID, addressID) => {
  const result = await fetchWithAuth(
    `/api/address/delete-address?userID=${userID}&addressID=${addressID}`,
    {
      method: "DELETE",
    }
  );
  
  return result;
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
  const result = await fetchWithAuth("/api/address/update-address", {
    method: "PUT",
    body: JSON.stringify(formData),
  });
  
  return result;
};

// Frontend service function to get all addresses for a user
export const getAllAddresses = async (userID) => {
  const result = await fetchWithAuth(
    `/api/address/get-all-address?userID=${userID}`,
    {
      method: "GET",
    }
  );
  
  return result;
};
