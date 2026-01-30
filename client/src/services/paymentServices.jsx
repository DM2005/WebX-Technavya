import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;


export async function createOrder(data) {
  try {
    const res = await axios.post(
      `${baseUrl}/api/payment/create-order`,
      data,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error creating order", err);
    throw err;
  }
}


export async function verifyPayment(data) {
  try {
    const res = await axios.post(
      `${baseUrl}/api/payment/verify-payment`,
      data,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error verifying payment", err);
    throw err;
  }
}
