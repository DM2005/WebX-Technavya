import axios from "axios"

const baseUrl = import.meta.env.VITE_API_URL;


export async function updateAssistantProfile(formData){
    try {
        const response = await axios.post(`${baseUrl}/api/assistant/update-profile`,
            {
                doctorId: formData.doctorId,
                hospitalId: formData.hospitalId
            },
            {withCredentials: true});
      return response.data;
        
    } catch (error) {
        console.log("Error in updating assistant profile !!",error)
    }

}


export async function getAssistantProfile() {
  try {
    const response = await axios.get(
      `${baseUrl}/api/assistant/get-profile`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching assistant profile !!", error);
    throw error;
  }
}
