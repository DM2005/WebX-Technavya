import axios from "axios";



const baseUrl = import.meta.env.VITE_API_URL;

export async function callAuthRegisterApi(formdata) {
  try {
    const response = await axios.post(
      `${baseUrl}/api/auth/register`,
      formdata,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Auth API Error:", error.response?.data || error.message);
    throw error;
  }
}



export async function callRoleApi(selectedRole, fcmToken) {
  try {
    const response = await axios.patch(
      `${baseUrl}/api/auth/select-role`,
      {
        role: selectedRole,
        fcmToken: fcmToken,
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error calling role API", error);
    throw error;
  }
}