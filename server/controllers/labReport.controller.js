
import { LabReport } from "../models/LabReport.js";
import { Patient } from "../models/Patient.js";
import { FamilyMember } from "../models/FamilyMember.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Create a new lab report
export const createLabReport = async (req, res) => {
  try {
    const {
      patientId,
      forPatientType,
      labId,
      testName,
      testType,
      result,
      normalRange,
      unit,
      diagnosis,
      doctorReference,
    } = req.body;

    if (
      !patientId ||
      !forPatientType ||
      !labId ||
      !testName ||
      !testType ||
      !result
    ) {
      return res.status(400).json({ error: "All required fields must be filled." });
    }

    // Validate forPatientType existence
    if (forPatientType === "Patient") {
      const patientExists = await Patient.findById(patientId);
      if (!patientExists) {
        return res.status(404).json({ error: "Patient not found." });
      }
    } else if (forPatientType === "FamilyMember") {
      const memberExists = await FamilyMember.findById(patientId);
      if (!memberExists) {
        return res.status(404).json({ error: "Family member not found." });
      }
    } else {
      return res.status(400).json({ error: "Invalid patient type." });
    }

    const newReport = new LabReport({
      patientId,
      forPatientType,
      labId,
      testName,
      testType,
      result,
      normalRange,
      unit,
      diagnosis,
      doctorReference,
    });

    await newReport.save();

    res.status(201).json({
      message: "Lab report created successfully.",
      report: newReport,
    });
  } catch (error) {
    console.error("Error creating lab report:", error);
    res.status(500).json({ error: "Failed to create lab report." });
  }
};

// Get all lab reports for logged-in patient (and optionally family members)
export const getLabReportsForPatient = async (req, res) => {
  try {
    const userId = req.user.id;

    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(404).json({ error: "Patient profile not found." });
    }

    const reports = await LabReport.find({
      $or: [
        { patientId: patient._id, forPatientType: "Patient" },
        { forPatientType: "FamilyMember", patientId: { $in: await FamilyMember.find({ patientId: patient._id }).distinct('_id') } }
      ]
    }).populate("labId").populate("doctorReference");

    res.status(200).json({ reports });
  } catch (error) {
    console.error("Error fetching lab reports:", error);
    res.status(500).json({ error: "Failed to fetch lab reports." });
  }
};

// Get lab reports for a specific family member
export const getReportsForFamilyMember = async (req, res) => {
  try {
    const { id } = req.params;

    const familyMember = await FamilyMember.findById(id);
    if (!familyMember) {
      return res.status(404).json({ error: "Family member not found." });
    }

    const reports = await LabReport.find({
      patientId: id,
      forPatientType: "FamilyMember",
    }).populate("labId").populate("doctorReference");

    res.status(200).json({ reports });
  } catch (error) {
    console.error("Error fetching family member reports:", error);
    res.status(500).json({ error: "Failed to fetch reports." });
  }
};

// Get reports issued by a specific lab (lab staff dashboard)
export const getReportsByLab = async (req, res) => {
  try {
    const { labId } = req.params;

    const reports = await LabReport.find({ labId }).populate("doctorReference");

    res.status(200).json({ reports });
  } catch (error) {
    console.error("Error fetching lab reports:", error);
    res.status(500).json({ error: "Failed to fetch lab reports." });
  }
};




// Get AI Summary of Lab Reports
// Get AI Summary of Lab Reports
export const getLabReportSummary = async (req, res) => {
  let reports = [];
  try {
    const userId = req.user.id;
    const patient = await Patient.findOne({ userId });

    if (!patient) {
      return res.status(404).json({ error: "Patient profile not found." });
    }

    // Fetch all reports using extended query to match the list view
    reports = await LabReport.find({
      $or: [
        { patientId: patient._id, forPatientType: "Patient" },
        // Include family members too if that's what the list does
        { forPatientType: "FamilyMember", patientId: { $in: await FamilyMember.find({ patientId: patient._id }).distinct('_id') } }
      ]
    }).populate("labId", "name");

    console.log(`Found ${reports.length} reports for summarization.`);

    if (reports.length === 0) {
      return res.status(200).json({ summary: "No lab reports found to summarize." });
    }

    // Prepare data for AI
    const reportsText = reports.map((r, i) => {
      return `Report ${i + 1}:
      Test: ${r.testName} (${r.testType})
      Result: ${r.result}
      Normal Range: ${r.normalRange}
      Diagnosis: ${r.diagnosis}
      Date: ${r.scheduledDate ? new Date(r.scheduledDate).toLocaleDateString() : 'N/A'}`;
    }).join("\n\n");

    const prompt = `You are an expert medical AI assistant. Analyze the following lab reports...`; // Truncated context

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt + "\nData:\n" + reportsText);
    const response = await result.response;
    const summary = response.text();

    return res.status(200).json({ summary });

  } catch (error) {
    console.error("Error generating lab summary (Switching to Local Mode):", error);

    // --- Advanced Logic-Based Lab Analysis ---
    const totalReports = reports.length;
    const testNames = [...new Set(reports.map(r => r.testName))].join(', ');

    let analysisText = "";
    const diagnosises = reports.map(r => r.diagnosis?.toLowerCase() || "").join(" ");

    if (diagnosises.includes("normal") || diagnosises.includes("negative")) {
      analysisText += "Several tests indicate normal or negative results. ";
    }
    if (diagnosises.includes("high") || diagnosises.includes("low") || diagnosises.includes("positive")) {
      analysisText += "Some results may be outside standard ranges (High/Low/Positive). Please consult your doctor for interpretation. ";
    }

    if (!analysisText) analysisText = "Review individual reports for specific details.";

    const localSummary = `**Lab Report Analysis**
    
    **Overview**: You have **${totalReports}** lab reports on file, covering: ${testNames}.
    
    **Analysis**:
    ${analysisText}
    
    *Note: Automated analysis generated based on available report data.*`;

    return res.status(200).json({ summary: localSummary });
  }
};
