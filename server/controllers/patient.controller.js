
import { Hospital } from "../models/Hospital.js";
import { Patient } from "../models/Patient.js";
import { Lab } from "../models/Lab.js"
import User from "../models/User.js";
import { LabAppointment } from "../models/LabAppointment.js";




export const patientProfile = async (req, res) => {
  try {
    const userId = req.user.id;


    let patient = await Patient.findOne({ userId });

    if (!patient) {
      patient = new Patient({ userId });
    }

    await patient.save();

    res.status(200).json({
      message: "Patient profile updated successfully.",
      patient,
    });
  } catch (error) {
    console.error("Error updating patient profile:", error);
    res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
};




// Fetch nearby hospitals within 10km
export const getNearbyHospitals = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    const nearbyHospitals = await Hospital.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          distanceField: "distance", // field added to each doc
          spherical: true,
          maxDistance: 100000000, // 10km in meters
        },
      },
      {
        $lookup: {
          from: "doctors",
          localField: "_id",
          foreignField: "hospitalId",
          as: "doctors",
        },
      },
      {
        $addFields: {
          averageRating: { $avg: "$doctors.averageRating" },
          totalReviews: { $sum: "$doctors.totalReviews" },
          averagePrice: { $avg: "$doctors.consultationFee" },
          minPrice: { $min: "$doctors.consultationFee" },
        },
      },
      {
        $project: {
          doctors: 0, // Exclude doctors array to keep response light
        },
      },
    ]);

    res.status(200).json({ hospitals: nearbyHospitals });
  } catch (error) {
    console.error("Error fetching nearby hospitals:", error);
    res.status(500).json({ error: "Failed to fetch nearby hospitals" });
  }
};



// fetch nearby labs within 10 km


export const getNearbylabs = async (req, res) => {
  try {
    // For production, use actual req.query values
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    const nearbyLabs = await Lab.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          distanceField: "distance", // Distance in meters
          spherical: true,
          maxDistance: 10000000000000, // 10 km in meters
        },
      },
    ]);

    res.status(200).json({ labs: nearbyLabs });
  } catch (error) {
    console.error("Error fetching nearby labs:", error);
    res.status(500).json({ error: "Failed to fetch nearby labs" });
  }
};





export const updateVitalsForUser = async (req, res) => {
  try {
    const { userId } = req.body;

    const {
      heartRate,
      bloodPressure,
      oxygenLevel,
      temperature,
      vitalUpdated
    } = req.body;
    //

    const user = await User.findById(userId);

    if (!user || user.role !== "patient") {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    user.heartRate = heartRate;
    user.bloodPressure = bloodPressure;
    user.oxygenLevel = oxygenLevel;
    user.temperature = temperature;
    user.vitalUpdated = true;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Vitals updated successfully",
      data: {
        heartRate: user.heartRate,
        bloodPressure: user.bloodPressure,
        oxygenLevel: user.oxygenLevel,
        temperature: user.temperature,
        vitalUpdated: user.vitalUpdated,
      },
    });



  } catch (error) {
    console.error("Error updating vitals:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


export const getVitalsForUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user || user.role !== "patient") {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    const vitals = {
      heartRate: user.heartRate,
      bloodPressure: user.bloodPressure,
      oxygenLevel: user.oxygenLevel,
      temperature: user.temperature,
    };

    res.status(200).json({
      success: true,
      data: vitals,
    });

  } catch (error) {
    console.error("Error fetching vitals:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}



export const getAllLabReportsBookedByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const reports = await LabAppointment.find({
      bookedBy: userId,
      reportPDF: { $exists: true, $ne: null },
    })
      .populate("labId", "name address")
      .sort({ createdAt: -1 });

    if (!reports || reports.length === 0) {
      return res.status(200).json({
        message: "No lab reports found.",
        reports: []
      });
    }

    res.status(200).json({
      message: "Lab reports fetched successfully.",
      reports,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Server error fetching lab reports." });
  }
};











