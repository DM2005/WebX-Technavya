import { MedicalRecord } from "../models/MedicalRecord.js";
import { Doctor } from "../models/Doctor.js";
import { Patient } from "../models/Patient.js";
import { GoogleGenerativeAI } from "@google/generative-ai";


export const addMedicalRecord = async (req, res) => {
  try {
    const userId = req.user.id;
    const doctor = await Doctor.findOne({ userId });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor profile not found." });
    }

    const {
      patientId,
      appointmentId,
      doctorId,
      hospitalId,
      medicines,
      notes,
    } = req.body;

    if (!patientId || !appointmentId || !doctorId || !hospitalId || !medicines || medicines.length === 0) {
      return res.status(400).json({ error: "All required fields must be provided." });
    }

    const record = new MedicalRecord({
      patientId,
      appointmentId,
      doctorId,
      hospitalId,
      medicines,
      notes,
    });

    await record.save();

    res.status(201).json({
      message: "Medicine record saved successfully.",
      record,
    });
  } catch (error) {
    console.error("Error saving medicine record:", error);
    res.status(500).json({ error: "Failed to save medicine record." });
  }
};

// Get medical history for a patient or family member
export const getMedicalRecords = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find patient profile for the user
    const patient = await Patient.findOne({ userId });

    if (!patient) {
      return res.status(404).json({ error: "Patient profile not found." });
    }

    const records = await MedicalRecord.find({ patientId: patient._id })
      .populate({
        path: "doctorId",
        select: "specialization hospitalId userId",
        populate: [
          {
            path: "hospitalId",
            select: "name",
          },
          {
            path: "userId",
            select: "name",
          },
        ],
      })


      .sort({ prescribedAt: -1 });

    res.status(200).json({
      message: "Medical records fetched.",
      total: records.length,
      records,
    });
  } catch (error) {
    console.error("Error fetching medical records:", error);
    res.status(500).json({ error: "Failed to fetch medical records." });
  }
};



export const getMedicalRecordSummary = async (req, res) => {
  let records = [];
  try {
    const userId = req.user.id;
    const patient = await Patient.findOne({ userId });

    if (!patient) {
      return res.status(404).json({ error: "Patient profile not found." });
    }

    records = await MedicalRecord.find({ patientId: patient._id });

    if (records.length === 0) {
      return res.status(200).json({ summary: "No medical records to summarize.", graphData: [] });
    }

    // 1. Prepare Graph Data (Aggregated by Type)
    const typeCounts = records.reduce((acc, record) => {
      const type = record.type || "Other";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const graphData = Object.keys(typeCounts).map(type => ({
      name: type,
      value: typeCounts[type]
    }));

    // 2. Prepare Data for AI Summary
    // Pick the last 5 records for recent context, plus summary stats
    const recentRecords = records.slice(0, 5).map((r, i) => `
      Record ${i + 1} (${r.type} - ${new Date(r.prescribedAt).toLocaleDateString()}):
      Notes: ${r.notes}
      Medicines: ${r.medicines.map(m => m.name).join(", ")}
    `).join("\n");

    const prompt = `
      Patient Medical History Summary.
      Total Visits: ${records.length}
      Recent Records:
      ${recentRecords}

      Analyze the patient's recent medical history. Provide a brief 3-4 sentence summary suitable for a patient dashboard. 
      Mention key treatments or frequent visit types. highlight any patterns (e.g., recurring checkups).
      Tone: Professional, Reassuring.
    `;

    console.log("Generating summary with model: gemini-1.5-flash");
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is missing in environment variables!");
      throw new Error("GEMINI_API_KEY missing");
    }

    // Initialize GoogleGenerativeAI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate Content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Summary generated successfully via @google/generative-ai");

    res.status(200).json({
      summary: text,
      graphData
    });

  } catch (error) {
    console.error("Error generating medical summary (switching to local mode):", error);

    // Write error to file for debugging
    import('fs').then(fs => {
      try {
        fs.writeFileSync('summary_error_log.txt', `Error: ${error.message}\nStack: ${error.stack}\nTime: ${new Date().toISOString()}\n`);
      } catch (e) { }
    });

    // --- Advanced Logic-Based Analysis (Simulated AI) ---
    // 1. Analyze Trends
    const totalVisits = records.length;
    const visitTypes = records.map(r => r.type || 'Consultation');
    const uniqueTypes = [...new Set(visitTypes)].join(', ');

    // 2. Extract Key Medical Data
    const notesText = records.map(r => r.notes?.toLowerCase() || "").join(" ");
    const medicinesText = records.flatMap(r => r.medicines.map(m => m.name.toLowerCase())).join(" ");

    let analysisText = "";

    // 3. Generate Insight Narrative
    if (notesText.includes("fever") || notesText.includes("temperature")) {
      analysisText += "Patient shows a history of recurring fever symptoms. ";
    }
    if (notesText.includes("pain") || notesText.includes("headache")) {
      analysisText += "Reports frequently mention pain management requirements. ";
    }
    if (medicinesText.includes("biotic") || medicinesText.includes("azithral") || medicinesText.includes("mox")) {
      analysisText += "Antibiotic courses have been prescribed to combat infection. ";
    }
    if (notesText.includes("blood pressure") || notesText.includes("bp")) {
      analysisText += "Cardiovascular vitals (BP) are being monitored. ";
    }

    // 4. Default if empty
    if (!analysisText) {
      analysisText = "Records indicate standard consultations with no critical anomalies flagged in text.";
    }

    // 5. Construct Final Summary
    const localSummary = `**Patient Health Analysis**
    
    **Overview**: The patient has a total of **${totalVisits}** records, primarily consisting of: ${uniqueTypes}.
    
    **Clinical Insights**:
    ${analysisText}
    
    **Recent Treatment**:
    The latest visit on ${new Date(records[0]?.prescribedAt || Date.now()).toLocaleDateString()} included: ${records[0]?.medicines?.map(m => m.name).join(", ") || "No medicines prescribed"}.
    
    *Note: Automated analysis generated based on available clinical data.*`;

    // Recalculate graph data if missing scope
    const graphData = records.reduce((acc, r) => {
      const type = r.type || "Other";
      const found = acc.find(item => item.name === type);
      if (found) { found.value++; }
      else { acc.push({ name: type, value: 1 }); }
      return acc;
    }, []);

    res.status(200).json({
      summary: localSummary,
      graphData: graphData
    });
  }
};
