import axios from "axios";
const baseUrl = import.meta.env.VITE_API_URL;

export async function getAllLabAppointmentbyLab(labId) {
  try {
    const response = await axios.get(`${baseUrl}/api/lab/all-lab-appointments/${labId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log("Error in getting all lab appointments !!", error.message);
  }
}


export const bookLabAppointment = async (data) => {
  try {
    const response = await axios.post(`${baseUrl}/api/lab/lab-appointments/book-appointment`, data,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
  catch (error) {
    console.log("ERROR Booking Lab", error)
  }
};

export async function uploadLabReport(appointmentId, reportPDFUrl) {
  if (!appointmentId || !reportPDFUrl) {
    throw new Error("Missing appointment ID or PDF URL");
  }

  const response = await axios.post(
    `${baseUrl}/api/lab/lab-appointments/${appointmentId}/upload-report`,
    { reportPDF: reportPDFUrl },
    {
      withCredentials: true,
    }
  );
  return response.data;
}

export async function updateLab(formData) {
  try {
    const response = await axios.put(
      `${baseUrl}/api/lab/profile`,
      formData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating Lab profile!", error);
    throw error.response?.data || error;
  }
}


export async function registerLab(data) {
  try {
    const response = await axios.post(
      `${baseUrl}/api/lab/register`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error registering Lab!", error);
    throw error.response?.data || error;
  }
}

export async function getLabProfile(params = {}) {
  const url = new URL(`${baseUrl}/api/lab/profile`);
  Object.entries(params).forEach(
    ([key, value]) => url.searchParams.append(key, value)
  );
  const response = await axios.get(url.toString(), { withCredentials: true });
  return response.data;
}


export async function getAllLabReport() {
  try {
    const response = await axios.get(
      `${baseUrl}/api/patient/lab-Reports`,
      { withCredentials: true }
    );
    return response.data;

  } catch (error) {
    console.log("Error in fetching lab reports in lab service", error);
    throw error.response?.data || error;
  }



}

export async function getLabReportSummaryAPI() {
  try {
    const response = await axios.get(`${baseUrl}/api/patient/lab-report-summary`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching lab report summary:", error);
    throw error.response?.data || error;
  }
}



