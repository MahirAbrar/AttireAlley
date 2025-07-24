import { fetchWithAuth } from "@/utils/fetchWithAuth";

export const callStripeSession = async (formData) => {
  const data = await fetchWithAuth("/api/stripe/route", {
    method: "POST",
    body: JSON.stringify(formData),
  });
  return data;
};
