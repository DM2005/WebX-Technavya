import axios from "axios";
const baseUrl = import.meta.env.VITE_API_URL;
export async function sendChatMessage(userMessage, userData, fileData = null) {
    try {
        const response = await axios.post(`${baseUrl}/api/ai/chat`, { userMessage, userData, fileData }, { withCredentials: true });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error in chatBotService:", error);
        throw new Error("Failed to process chat messages");
    }
}
