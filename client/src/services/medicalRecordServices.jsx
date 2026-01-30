import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;


export async function addMedicalRecordAPI(formData) {

  try {
    const response = await axios.post(
      `${baseUrl}/api/record/medical-record`,
      formData,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error in adding medical record!!", error);
  }
}




export async function getMedicalRecordsAPI(patientId) {
  try {
    const response = await axios.get(`${baseUrl}/api/record/get-medical-record`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error in fetching medical records!!", error);
  }
}


export async function getMedicalRecordSummaryAPI() {
  try {
    console.log("Fetching summary from:", `${baseUrl}/api/record/summary`);
    const response = await axios.get(`${baseUrl}/api/record/summary`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching medical record summary!!", error);
    throw error;
  }
}
