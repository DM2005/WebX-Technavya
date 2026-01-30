// controllers/assistantController.js
import { Assistant } from "../models/Assistant.js";
import { Hospital } from "../models/Hospital.js";
import { Doctor } from "../models/Doctor.js";

export const registerAssistant = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: user ID not found" });
  }

  const { hospitalId, doctorId } = req.body;

  if (!hospitalId || !doctorId) {
    return res.status(400).json({
      success: false,
      message: "Hospital ID and Doctor ID are required",
    });
  }

  try {
    // Optional: Validate hospital and doctor existence
    const hospitalExists = await Hospital.findById(hospitalId);
    const doctorExists = await Doctor.findById(doctorId);

    if (!hospitalExists || !doctorExists) {
      return res
        .status(404)
        .json({ success: false, message: "Hospital or Doctor not found" });
    }

    // Check if it exists already or not
    let assistant = await Assistant.findOne({ userId });

    if (assistant) {
      // Optional: update hospital/doctor if re-registering
      assistant.hospitalId = hospitalId;
      assistant.doctorId = doctorId;
      await assistant.save();

      return res.status(200).json({
        success: true,
        message: "Assistant profile updated",
        assistant,
      });
    }

    // Create new assistant
    const newAssistant = new Assistant({
      userId,
      hospitalId,
      doctorId,
    });

    await newAssistant.save();

    res.status(201).json({
      success: true,
      message: "Assistant registered successfully",
      assistant: newAssistant,
    });
  } catch (error) {
    console.error("Assistant Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "Error registering assistant",
      error: error.message
    });
  }
};


export const getAssistantProfile = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: user ID not found",
    });
  }

  try {
    const assistant = await Assistant.findOne({ userId })
      .populate({
        path: "doctorId",
        populate: {
          path: "userId", // <-- nested population
          model: "User",
          select: "name email"
        },
        select: "specialization gender userId" // needed to keep userId for nested population
      })
      .populate({
        path: "hospitalId",
        select: "name address phone"
      });

    if (!assistant) {
      return res.status(404).json({
        success: false,
        message: "Assistant profile not found",
      });
    }

    res.status(200).json({
      success: true,
      assistant,
    });
  } catch (error) {
    console.error("Error fetching assistant profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching assistant profile",
      error: error.message,
    });
  }
};



