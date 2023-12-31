export const LoginUser = async (formData) => {
  try {
    console.log(
      "logging in from services",
      "sending",
      JSON.stringify(formData),
    );

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    console.log("This is the response", data);

    if (!response.ok) {
      return {
        success: false,
        message:
          data.message || "Network response was not ok from services/login",
      };
    }

    return { success: true, data };
  } catch (e) {
    console.log("error in services/login", e);
    return { success: false, message: e.message };
  }
};
