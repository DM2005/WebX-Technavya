import axios from "axios"
const baseUrl = import.meta.env.VITE_API_URL;
export async function doctorProfileApi(formData){
    try {
        const response = await axios.post(
            `${baseUrl}/api/doctor/profile`,
            formData,
            { withCredentials: true }
        );
      return response.data;
        
    } catch (error) {
        console.log("Error in Doctor service !!",error)
    }

}

export async function getDoctorProfileApi(){
    try {
        const response = await axios.get(
            `${baseUrl}/api/doctor/get-profile`,
            { withCredentials: true }
        );
      return response.data;

    } catch (error) {
        console.log("Error in Doctor service !!",error)
    }

}






export async function todaysPatientsApi(){
    try {
        const response = await axios.get(
            `${baseUrl}/api/doctor/getAllDrAppointments`,
            { withCredentials: true }
        );
      return response.data;

    } catch (error) {
        console.log("Error in Doctor service !!",error)
    }
}


export async function todaysOnlinePatientsApi(){
    try {
        const response = await axios.get(
            `${baseUrl}/api/doctor/getOnlineAppointments`,
            { withCredentials: true }
        );
      return response.data;

    } catch (error) {
        console.log("Error in Doctor service !!",error)
    }
}




