export const registerNewUser = async (formData) => {
  try {
    console.log("registerNewUser");
    console.log(JSON.stringify(formData));
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const finalData = await response.json();

    return finalData;
  } catch (e) {
    console.log("error in services/register", e);
  }
};
