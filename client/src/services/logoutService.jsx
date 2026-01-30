// services/logoutService.js
import axios from "axios";
const baseUrl = import.meta.env.VITE_API_URL;
export async function logoutUser() {
  try {
    const response = await axios.post(
      `${baseUrl}/api/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.log("Error in logout:", error);
    return null;
  }
}
