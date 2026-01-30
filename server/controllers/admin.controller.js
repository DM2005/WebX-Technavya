import User from '../models/User.js';
import { Hospital } from '../models/Hospital.js';
import { Patient } from '../models/Patient.js';

// GET /api/admin/stats
// Returns aggregate counts for quick admin overview.

export const getAdminStats = async (req, res) => {
  try {
    const [users, hospitals, patients] = await Promise.all([
      User.countDocuments(),
      Hospital.countDocuments(),
      Patient.countDocuments(),
    ]);

    return res.json({
      users,
      hospitals,
      patients,
      message: 'Admin stats fetched',
    });
  } catch (err) {
    console.error('Admin stats error', err);
    return res.status(500).json({ message: 'Failed to fetch admin stats' });
  }
};

// GET /api/admin/users/:id
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user });
  } catch (err) {
    console.error('getUserById error', err);
    return res.status(500).json({ message: 'Failed to fetch user' });
  }
};


// DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ message: 'User deleted', user });
  } catch (err) {
    console.error('deleteUser error', err);
    return res.status(500).json({ message: 'Failed to delete user' });
  }
};

// GET /api/admin/hospitals
export const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find().populate({ path: 'userId', select: 'name email' }).lean();
    return res.json({ total: hospitals.length, hospitals });
  } catch (err) {
    console.error('getAllHospitals error', err);
    return res.status(500).json({ message: 'Failed to fetch hospitals' });
  }
};

// POST /api/admin/hospitals
// body: { userId, name, phone, address, licenseNumber, longitude, latitude }
export const createHospitalForUser = async (req, res) => {
  try {
    const { userId, name, phone, address, licenseNumber, longitude, latitude } = req.body;
    if (!userId || !name || !phone || !address || !licenseNumber || longitude == null || latitude == null) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existing = await Hospital.findOne({ userId });
    if (existing) return res.status(400).json({ message: 'Hospital already exists for this user' });

    const hospital = new Hospital({
      userId,
      name,
      phone,
      address,
      licenseNumber,
      location: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
    });

    await hospital.save();
    return res.status(201).json({ message: 'Hospital created', hospital });
  } catch (err) {
    console.error('createHospitalForUser error', err);
    return res.status(500).json({ message: 'Failed to create hospital' });
  }
};

// DELETE /api/admin/hospitals/:id
export const deleteHospital = async (req, res) => {
  try {
    const { id } = req.params;
    const hospital = await Hospital.findByIdAndDelete(id);
    if (!hospital) return res.status(404).json({ message: 'Hospital not found' });
    return res.json({ message: 'Hospital deleted', hospital });
  } catch (err) {
    console.error('deleteHospital error', err);
    return res.status(500).json({ message: 'Failed to delete hospital' });
  }
};
