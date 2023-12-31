export const registerNewUser = async (formData) => {
  try {
    console.log("services/ register");
    console.log(JSON.stringify(formData));
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Network response was not ok",
      };
    }

    return { success: true, data };
  } catch (e) {
    console.log("error in services/register", e);
    return { success: false, message: e.message };
  }
};
