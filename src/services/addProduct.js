import Cookies from "js-cookie";

// Frontend will send to Backend API

export const addNewProduct = async (formData) => {
  try {
    const response = await fetch(`/api/admin/add-product?userID=${formData.user}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message:
          data.message || "Network response was not ok from services/product",
      };
    }

    return { success: true, data };
  } catch (e) {
    return { success: false, message: e.message };
  }
};
