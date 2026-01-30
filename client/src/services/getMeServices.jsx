import axios from "axios"
const baseUrl = import.meta.env.VITE_API_URL;

export async function getMe(){
    try {
        const response = await axios.get(`${baseUrl}/api/auth/me`, {
        withCredentials: true,
      });
      return response.data;
        
    } catch (error) {
        console.log("Error in fetching my info , getME !!",error)
    }

}