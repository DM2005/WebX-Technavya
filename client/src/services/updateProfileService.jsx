import axios from "axios";
const baseUrl = import.meta.env.VITE_API_URL;

export async function updatePatient(formData) {
  try {
    const response = await axios.post(
      `${baseUrl}/api/patient/profile`,
      formData,
      {
        withCredentials: true,
       
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error in updating patient profile!!", error);
  }
}
