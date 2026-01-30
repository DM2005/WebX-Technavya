import mongoose from 'mongoose';

const vitalSignsSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
    unique: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  heartRate: {
    type: String,
    required: true,
  },
  bloodPressure: {
    type: String,
    required: true,
  },
  temperature: {
    type: String,
    required: true,
  },
  oxygenLevel: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const VitalSigns = mongoose.model('VitalSigns', vitalSignsSchema);

export default VitalSigns;
