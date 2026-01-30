import { LabAppointment } from "../models/LabAppointment.js";


export const bookLabAppointment = async (req, res) => {
  try {
    const {
      forPatientType,
      labId,
      testDetails,
      scheduledDate,
      timeSlot,
      notes,
      doctorReference,
    } = req.body;

    if (
      !forPatientType ||
      !labId ||
      !testDetails?.testName ||
      !testDetails?.testType ||
      !scheduledDate ||
      !timeSlot
    ) {
      return res.status(400).json({ error: "All required fields must be filled." });
    }

      const appointmentData = {
        forPatientType,
        labId,
        testDetails,
        scheduledDate,
        timeSlot,
        notes,
        doctorReference,
      };

      if (req.user?.id) appointmentData.bookedBy = req.user.id;
      if (req.body.bookedBy) appointmentData.bookedBy = req.body.bookedBy;

      const appointment = new LabAppointment(appointmentData);
    const saved = await appointment.save();

    res.status(201).json({
      message: "Lab appointment booked successfully.",
      appointment: saved,
    });
  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).json({ error: "Server error while booking appointment." });
  }
};

// @desc: Get all lab appointments for a user
export const getMyLabAppointments = async (req, res) => {
  try {
    const appointments = await LabAppointment.find({
      bookedBy: req.user.id,
      isDeleted: false,
    })
      .populate("labId", "name address")
      .populate("doctorReference", "name specialization")
      .sort({ createdAt: -1 });

    res.status(200).json(appointments);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Unable to fetch appointments." });
  }
};


export const getTodayLabAppointmentCount = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0);

    const count = await LabAppointment.countDocuments({
      scheduledDate: { $gte: startOfDay, $lt: endOfDay },
      isDeleted: false
    });

    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: "Could not count today's appointments." });
  }
};

// Returns all today's appointments for a specific lab
export const getTodayAppointmentsForLab = async (req, res) => {
  try {
    const { labId } = req.params; // pass labId as a URL param
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0);

    const appointments = await LabAppointment.find({
      labId,
      scheduledDate: { $gte: startOfDay, $lt: endOfDay },
      isDeleted: false
    })
    .populate("bookedBy", "name") // Get patient basic info
    .populate("doctorReference", "name");

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: "Unable to fetch today's appointments." });
  }
};


export const uploadReportForAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reportPDF } = req.body;

    if (!id || !reportPDF) {
      return res.status(400).json({ error: "Missing appointment ID or report URL" });
    }

    const appointment = await LabAppointment.findByIdAndUpdate(
      id,
      { reportPDF },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.status(200).json({
      message: "Report uploaded successfully",
      appointment,
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Server error uploading report" });
  }
};





export const getAllLabAppointments = async (req, res) => {
  try {
    const {labId} = req.params;
    const appointments = await LabAppointment.find({labId})
      .populate("labId", "name address")
      .populate("bookedBy", "name phone email")
      .populate("doctorReference", "name specialization")
      .sort({ scheduledDate: -1 });

    res.status(200).json({ appointments });

  } catch (error) {
    console.error("Error fetching all lab appointments:", error);
    res.status(500).json({ error: "Failed to fetch all lab appointments." });
    
  }
}
