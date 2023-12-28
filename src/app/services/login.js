// Run this function of LoginUser

export const loginUser = async (formData) => {
  try {
    console.log("logging in from services");
    console.log(JSON.stringify(formData));
    const response = await fetch("/api/login.js", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    console.log(response);

    if (!response.ok) {
      throw new Error("Network response was not ok from services/login");
    }

    const finalData = await response.json();

    return finalData;
  } catch (e) {
    console.log("error in services/login", e);
  }
};
