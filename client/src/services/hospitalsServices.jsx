import axios from "axios";
const baseUrl = import.meta.env.VITE_API_URL;

export async function getAllDoctorsbyHospitals(hospitalId) {
  try {
    const response = await axios.get(`${baseUrl}/api/doctor/getAllDoctors?hospitalId=${hospitalId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log("Error in fetching all doctors !!", error);
  }
}


export async function registerHospital(formdata) {
  try {
    const response = await axios.post(`${baseUrl}/api/hospital/register`, formdata, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error registering hospital:", error);
    throw error; // Re-throw the error for further handling
  }
}

export async function getHospital() {
  try {
    const response = await axios.get(`${baseUrl}/api/hospital/profile`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching hospital profile:", error);
    throw error; // Re-throw the error for further handling
  }
}


export async function getPatientsByHospital() {
  try {
    const response = await axios.get(`${baseUrl}/api/hospital/stats`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching hospital profile:", error);
    throw error; // Re-throw the error for further handling
  }
}



export async function getAllHospitalPatients() {
  try {
    const response = await axios.get(`${baseUrl}/api/hospital/patients`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all hospital patients:", error);
    throw error; // Re-throw the error for further handling
  }
}

export async function getAllAssistantsForHospital() {
  try {
    const response = await axios.get(`${baseUrl}/api/hospital/all-assistants`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all assistants for hospital:", error);
    throw error; // Re-throw the error for further handling
  }
}




export async function addDoctorByHospital(formData) {
  try {
    const response = await axios.post(`${baseUrl}/api/hospital/add-doctor`, formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding doctor:", error);
    throw error;
  }
}

export async function addAssistantByHospital(formData) {
  try {
    const response = await axios.post(`${baseUrl}/api/hospital/add-assistant`, formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding assistant:", error);
    throw error;
  }
}
