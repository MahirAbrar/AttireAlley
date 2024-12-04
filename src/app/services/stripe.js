import Cookies from "js-cookie";

export const callStripeSession = async (formData) => {
  console.log("callStripeSession");
  try {
    const res = await fetch("/api/stripe/route", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(e);
  }
};
