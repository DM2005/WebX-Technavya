import { FamilyMember } from "../models/FamilyMember.js";
import { Patient } from "../models/Patient.js";

// Create or Add a new family member
export const addFamilyMember = async (req, res) => {
  try {
    const userId = req.user.id;

    const { name, age, gender, relation, medicalNotes } = req.body;

    if (!name || !gender || !relation) {
      return res.status(400).json({ error: "Name, gender, and relation are required." });
    }

    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(404).json({ error: "Patient profile not found." });
    }

    const newFamilyMember = new FamilyMember({
      patientId: patient._id,
      name,
      age,
      gender,
      relation,
      medicalNotes,
    });

    await newFamilyMember.save();

    res.status(201).json({
      message: "Family member added successfully.",
      familyMember: newFamilyMember,
    });
  } catch (error) {
    console.error("Error adding family member:", error);
    res.status(500).json({ error: "Failed to add family member." });
  }
};

// Get all family members for the logged-in patient
export const getFamilyMembers = async (req, res) => {
  try {
    const userId = req.user.id;

    const patient = await Patient.findOne({ userId });
    if (!patient) {
      return res.status(404).json({ error: "Patient profile not found." });
    }

    const familyMembers = await FamilyMember.find({ patientId: patient._id });

    res.status(200).json({ familyMembers });
  } catch (error) {
    console.error("Error fetching family members:", error);
    res.status(500).json({ error: "Failed to get family members." });
  }
};


// Delete a family member
export const deleteFamilyMember = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMember = await FamilyMember.findByIdAndDelete(id);

    if (!deletedMember) {
      return res.status(404).json({ error: "Family member not found." });
    }

    res.status(200).json({ message: "Family member deleted." });
  } catch (error) {
    console.error("Error deleting family member:", error);
    res.status(500).json({ error: "Failed to delete family member." });
  }
};
