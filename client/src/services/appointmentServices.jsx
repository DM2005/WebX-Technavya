import axios from "axios"
const baseUrl = import.meta.env.VITE_API_URL;

export async function getAllApointments() {
    try {
        const response = await axios.get(`${baseUrl}/api/appointment/all-appointments`, {
            withCredentials: true,
        });
        console.log(response)
        return response.data;

    } catch (error) {
        console.log("Error in fetching all Appointments !!", error)
    }

}
export async function getOnlineApointments() {
    try {
        const response = await axios.get(`${baseUrl}/api/appointment/online-appointment`, {
            withCredentials: true,
        });
        console.log(response)
        return response.data;

    } catch (error) {
        console.log("Error in fetching online Appointments !!", error)
    }

}

export async function cancelAppointmentAPI(appointmentId) {
    try {
        const response = await axios.patch(`${baseUrl}/api/appointment/${appointmentId}/cancel`, {}, {
            withCredentials: true,
        });
        return response;
    } catch (error) {
        console.log("Error cancelling appointment:", error);
        throw error;
    }
}