import axios from "axios"
const baseUrl = import.meta.env.VITE_API_URL;
export async function notifyViaFCM(userId){
    try {
        const response = await axios.post(
            `${baseUrl}/api/firebase/send-notification`,
            {
            title: "Appointment Confirmation",
            body: "Your appointment is confirmed! We kindly request you to arrive at the hospital within 30 minutes.",
            userId
            },
            { withCredentials: true }
        );
      return response.data;
        
    } catch (error) {
        console.log("Error in Firebase service !!",error)
    }

}