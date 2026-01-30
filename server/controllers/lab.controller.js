import { Lab } from "../models/Lab.js";


// Register a new lab
export const registerLab = async (req, res) => {
  try {
    const userId = req.user.id;
    const {name , phone ,  address, licenseNumber, coordinates, testTypes } = req.body;

    if (!name || !phone || !address || !licenseNumber || !coordinates) {
      return res.status(400).json({ error: "All required fields must be provided." });
    }

    const existingLab = await Lab.findOne({ userId });
    if (existingLab) {
      return res.status(400).json({ error: "Lab already registered for this user." });
    }
     // user id
    const newLab = new Lab({
      userId,
      name , 
      phone , 
      address,
      licenseNumber,
      location: {
        type: "Point",
        coordinates,
      },
      testTypes,
    });

    await newLab.save();

    res.status(201).json({ message: "Lab Registered Successfully.", lab: newLab });
  } catch (error) {
    console.error("Error registering lab:", error);
    res.status(500).json({ error: "Failed to register lab." });
  }
};

// Get the lab profile of the current user

export const getMyLabProfile = async (req, res) => {
  try {
    const lab = await Lab.findOne({ userId: req.user.id }).populate("userId");

    if (!lab) {
      return res.status(404).json({ error: "Lab profile not found." });
    }

    res.status(200).json({lab,success: true});
  } catch (error) {
    console.error("Error fetching lab profile:", error);
    res.status(500).json({ error: "Failed to fetch lab profile." });
  }
};
// Update lab profile
export const updateLabProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    const lab = await Lab.findOneAndUpdate({ userId }, updates, { new: true });

    if (!lab) {
      return res.status(404).json({ error: "Lab profile not found." });
    }

    res.status(200).json({ message: "Lab profile updated.", lab });
  } catch (error) {
    console.error("Error updating lab profile:", error);
    res.status(500).json({ error: "Failed to update lab profile." });
  }
};


export const verifyLab = async (req, res) => {
  try {
    const { labId } = req.params;

    const lab = await Lab.findByIdAndUpdate(labId, { isVerified: true }, { new: true });

    if (!lab) {
      return res.status(404).json({ error: "Lab not found." });
    }

    res.status(200).json({ message: "Lab verified successfully.", lab });
  } catch (error) {
    console.error("Error verifying lab:", error);
    res.status(500).json({ error: "Failed to verify lab." });
  }
};



export const getMyLab = async (req, res) => {
  try {
    const lab = await Lab.findOne({ userId: req.user._id }); // auth middleware must populate req.user
    if (!lab) return res.status(404).json({ error: "Lab not found" });
    res.json(lab);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};



