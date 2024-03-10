import Cookies from "js-cookie";

// Frontend will send to Backend API

export const addNewProduct = async (formData) => {
  try {
    console.log(
      "adding product in from services",
      "sending",
      JSON.stringify(formData),
    );

    const response = await fetch("/api/admin/add-product", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    console.log("This is the response", data);

    if (!response.ok) {
      return {
        success: false,
        message:
          data.message || "Network response was not ok from services/product",
      };
    }

    return { success: true, data };
  } catch (e) {
    console.log("error in services/product", e);
    return { success: false, message: e.message };
  }
};
