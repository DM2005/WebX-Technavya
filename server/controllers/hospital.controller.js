import { Hospital } from "../models/Hospital.js";
import { Assistant } from "../models/Assistant.js";
import { Doctor } from "../models/Doctor.js";
import { Appointment } from "../models/Appointment.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Register a Doctor by Hospital Admin
export const registerDoctorByHospital = async (req, res) => {
  try {
    const userId = req.user.id; // Hospital Admin's User ID
    const {
      name,
      email,
      phone,
      password,
      gender,
      specialization,
      experience,
      licenseNumber,
      education,
      consultationFee
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password || !gender || !specialization || !licenseNumber || !education || !consultationFee) {
      return res.status(400).json({ error: "All required fields must be provided." });
    }

    // 1. Find the Hospital associated with the Admin
    const hospital = await Hospital.findOne({ userId });
    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found for this admin." });
    }

    // 2. Check if User (Email) already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists." });
    }

    // 3. Create User account for Doctor
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "doctor",
      isVerified: true,
    });
    await newUser.save();

    // 4. Create Doctor Profile
    const newDoctor = new Doctor({
      userId: newUser._id,
      hospitalId: hospital._id,
      gender,
      specialization,
      experience: experience || 0,
      licenseNumber,
      education,
      consultationFee: consultationFee || 0,
    });
    await newDoctor.save();

    res.status(201).json({
      success: true,
      message: "Doctor registered successfully.",
      doctor: {
        ...newDoctor.toObject(),
        userId: newUser.toObject()
      }
    });

  } catch (error) {
    console.error("Error registering doctor:", error);
    res.status(500).json({ error: error.message || "Failed to register doctor by hospital." });
  }
};


// Register an Assistant by Hospital Admin
export const registerAssistantByHospital = async (req, res) => {
  try {
    const userId = req.user.id; // Hospital Admin's User ID
    const {
      name,
      email,
      phone,
      password,
      doctorId
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password || !doctorId) {
      return res.status(400).json({ error: "All required fields must be provided." });
    }

    // 1. Find the Hospital associated with the Admin
    const hospital = await Hospital.findOne({ userId });
    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found for this admin." });
    }

    // 2. Check if User (Email) already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists." });
    }

    // 3. Create User account for Assistant
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "assistant", // Set role to assistant
      isVerified: true,
    });
    await newUser.save();

    // 4. Create Assistant Profile
    const newAssistant = new Assistant({
      userId: newUser._id,
      hospitalId: hospital._id,
      doctorId, // Linked Doctor
      isVerified: true
    });
    await newAssistant.save();

    res.status(201).json({
      success: true,
      message: "Assistant registered successfully.",
      assistant: {
        ...newAssistant.toObject(),
        userId: newUser.toObject()
      }
    });

  } catch (error) {
    console.error("Error registering assistant:", error);
    res.status(500).json({ error: error.message || "Failed to register assistant by hospital." });
  }
};

// Register a hospital
export const registerHospital = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, address, licenseNumber, longitude, latitude } = req.body;

    if (!name || !phone || !address || !licenseNumber || !longitude || !latitude) {
      return res.status(400).json({ error: "All required fields must be provided." });
    }

    const existingHospital = await Hospital.findOne({ userId });
    if (existingHospital) {
      return res.status(400).json({ error: "Hospital already registered." });
    }

    // Create a new Hospital document/instance with the given details
    const hospital = new Hospital({
      userId,        // Reference to the user who is adding/registering the hospital
      name,          // Hospital's name
      phone,         // Contact number of the hospital
      address,       // Physical address of the hospital
      licenseNumber, // Official license/registration number of the hospital

      // GeoJSON location object to store hospital's coordinates
      location: {
        type: "Point", // GeoJSON type (Point = single coordinate pair)
        coordinates: [
          parseFloat(longitude), // Longitude converted to float
          parseFloat(latitude),  // Latitude converted to float
        ],
      },
    });

    await hospital.save();

    res.status(201).json({ message: "Hospital registered successfully.", hospital, success: true });
  } catch (error) {
    console.error("Error registering hospital:", error);
    res.status(500).json({ error: "Failed to register hospital." });
  }
};

// Get hospital profile for logged-in admin
// Get hospital profile for logged-in admin
export const getMyHospitalProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const hospital = await Hospital.findOne({ userId }).populate({
      path: "userId",
      select: "name email"
    });

    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found." });
    }

    res.status(200).json({ hospital });
  } catch (error) {
    console.error("Error fetching hospital profile:", error);
    res.status(500).json({ error: "Failed to fetch hospital profile." });
  }
};


// Get total patients and patient counts by doctor department
export const getPatientStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find hospital by logged-in user ID
    const hospital = await Hospital.findOne({ userId });
    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found." });
    }

    // Get all doctors under this hospital, and populate their user name
    const doctors = await Doctor.find({ hospitalId: hospital._id }).populate({
      path: "userId",
      select: "name", // get doctor name from User model
    });

    const doctorIds = doctors.map((doc) => doc._id);

    // Get appointments linked to these doctors
    const appointments = await Appointment.find({ doctorId: { $in: doctorIds } }).populate({
      path: "patientId",
      populate: {
        path: "userId",
        select: "name phone", // get patient name & phone from User model
      },
    });

    // Initialize mapping of doctors to their patients
    const doctorPatientsMap = {};

    for (const doctor of doctors) {
      doctorPatientsMap[doctor._id.toString()] = {
        doctorId: doctor._id,
        doctorName: doctor.userId?.name || "Unknown Doctor",
        specialization: doctor.specialization,
        patients: [],
      };
    }

    // Group patients under each doctor (avoiding duplicates)
    for (const appointment of appointments) {
      const doctorId = appointment.doctorId.toString();
      const patient = appointment.patientId;

      if (patient && patient.userId && doctorPatientsMap[doctorId]) {
        const patientUser = patient.userId;

        // Avoid duplicate patients for same doctor
        const alreadyAdded = doctorPatientsMap[doctorId].patients.some(
          (p) => p._id.toString() === patient._id.toString()
        );

        if (!alreadyAdded) {
          doctorPatientsMap[doctorId].patients.push({
            _id: patient._id,            // patient schema ID
            userId: patientUser._id,     // user ID from User model
            name: patientUser.name,
            phone: patientUser.phone,
            age: patient.age,
            gender: patient.gender,
            address: patient.address,
          });
        }
      }
    }

    // Final list of doctors with their patients
    const doctorsWithPatients = Object.values(doctorPatientsMap);

    res.status(200).json({
      totalDoctors: doctorsWithPatients.length,
      doctors: doctorsWithPatients,
    });
  } catch (error) {
    console.error("Error fetching doctor-patient data:", error);
    res.status(500).json({ error: "Failed to fetch doctor-wise patient stats." });
  }
};


export const getAllHospitalPatients = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the hospital linked to this user
    const hospital = await Hospital.findOne({ userId });
    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found." });
    }

    // Fetch all appointments for this hospital
    const appointments = await Appointment.find({ hospitalId: hospital._id })
      .populate({
        path: "patientId",
        populate: {
          path: "userId",
          select: "name phone", // Only fetch name & phone from user
        },
      })
      .populate({
        path: "bookedBy",
        select: "name phone email gender age bloodPressure heartRate oxygenLevel temperature", // Fetch details from bookedBy (User)
      })
      .populate({
        path: "doctorId",
        select: "name specialization", // Optional: Doctor info
      })
      .populate("hospitalId", "name"); // Optional: Hospital info

    // Format appointment list
    const patientAppointments = appointments.map((appointment) => {
      let name, phone, age, gender, address, userId, patientId, vitals = {};
      const vitalFields = ['bloodPressure', 'heartRate', 'oxygenLevel', 'temperature'];
      const defaultVitals = { bloodPressure: '--', heartRate: '--', oxygenLevel: '--', temperature: '--' };

      if (appointment.forPatient?.type === "family" && appointment.patientId) {
        // It's a family member or distinct patient record
        const patient = appointment.patientId;
        const user = patient?.userId;

        patientId = patient?._id;
        userId = user?._id;
        name = user?.name || "Unknown"; // Fallback to unknown if missing
        phone = user?.phone;

        if (user) {
          vitalFields.forEach(field => { vitals[field] = user[field] || defaultVitals[field] });
        } else {
          vitals = defaultVitals;
        }

      } else {
        // It's 'self'
        const user = appointment.bookedBy;
        userId = user?._id;
        patientId = null;
        name = user?.name;
        phone = user?.phone;

        if (user) {
          vitalFields.forEach(field => { vitals[field] = user[field] || defaultVitals[field] });
        } else {
          vitals = defaultVitals;
        }
      }

      // Consolidate from Appointment document (snapshot) first for Age/Gender as they are on Appointment schema
      age = appointment.age;
      gender = appointment.gender;
      // Address is not on Appointment, maybe on User? User schema doesn't have address. 
      // Hospital controller earlier mapped `patient?.address`. Patient schema doesn't have address. 
      // Maybe it was hallucinated or from an old version. I will omit address checks to avoid errors.

      return {
        appointmentId: appointment._id,
        patientId: patientId, // might be null for self
        userId: userId,
        name: name || "Unknown",
        phone: phone,
        age: age,
        gender: gender,
        doctorName: appointment.doctorId?.name,
        specialization: appointment.doctorId?.specialization,
        appointmentDate: appointment.date,
        status: appointment.status,
        ...vitals
      };
    });

    res.status(200).json({
      totalAppointments: patientAppointments.length,
      appointments: patientAppointments,
    });
  } catch (error) {
    console.error("Error fetching hospital patients:", error);
    res.status(500).json({ error: "Failed to fetch appointment details." });
  }
};



export const getAllAssistantsForHospital = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: user ID not found",
    });
  }

  try {
    // Find hospital from logged-in user
    const hospital = await Hospital.findOne({ userId });

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
    }

    // Fetch all assistants for that hospital
    const assistants = await Assistant.find({ hospitalId: hospital._id })
      .populate({
        path: "doctorId",
        populate: {
          path: "userId",
          model: "User",
          select: "name email",
        },
        select: "specialization gender userId",
      })
      .populate({
        path: "userId",
        model: "User",
        select: "name email phone",
      });

    res.status(200).json({
      success: true,
      total: assistants.length,
      assistants,
    });
  } catch (error) {
    console.error("Error fetching assistants:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching assistants",
      error: error.message,
    });
  }
};








