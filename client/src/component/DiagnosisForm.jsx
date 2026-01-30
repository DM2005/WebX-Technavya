import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Save, 
  Pill, 
  Clock, 
  Calendar,
  FileText,
  User,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const DiagnosisForm = ({ patient, onClose, onSubmit, doctorId, hospitalId }) => {
  const [formData, setFormData] = useState({
    patientId: patient?.bookedBy?._id ,
    appointmentId: patient?._id,
    hospitalId : hospitalId?.hospitalId,
    doctorId: doctorId?.doctorId?._id,
    medicines: [
      {
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        notes: ''
      }
    ],
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Predefined options for dropdowns
  const frequencyOptions = [
    'Once daily (OD)',
    'Twice daily (BD)',
    'Three times daily (TDS)',
    'Four times daily (QDS)',
    'Every 4 hours',
    'Every 6 hours',
    'Every 8 hours',
    'Every 12 hours',
    'Before meals',
    'After meals',
    'At bedtime',
    'As needed (PRN)'
  ];

  const durationOptions = [
    '3 days',
    '5 days',
    '7 days',
    '10 days',
    '14 days',
    '21 days',
    '30 days',
    '1 month',
    '2 months',
    '3 months',
    'Until follow-up',
    'As needed'
  ];

  const addMedicine = () => {
    setFormData(prev => ({
      ...prev,
      medicines: [
        ...prev.medicines,
        {
          name: '',
          dosage: '',
          frequency: '',
          duration: '',
          notes: ''
        }
      ]
    }));
  };

  const removeMedicine = (index) => {
    if (formData.medicines.length > 1) {
      setFormData(prev => ({
        ...prev,
        medicines: prev.medicines.filter((_, i) => i !== index)
      }));
    }
  };

  const updateMedicine = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      medicines: prev.medicines.map((medicine, i) => 
        i === index ? { ...medicine, [field]: value } : medicine
      )
    }));

    // Clear specific field error
    if (errors[`medicines.${index}.${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`medicines.${index}.${field}`]: ''
      }));
    }
  };

  const updateNotes = (value) => {
    setFormData(prev => ({
      ...prev,
      notes: value
    }));

    if (errors.notes) {
      setErrors(prev => ({
        ...prev,
        notes: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate medicines
    formData.medicines.forEach((medicine, index) => {
      if (!medicine.name.trim()) {
        newErrors[`medicines.${index}.name`] = 'Medicine name is required';
      } else if (medicine.name.length > 100) {
        newErrors[`medicines.${index}.name`] = 'Medicine name must be less than 100 characters';
      }

      if (!medicine.dosage.trim()) {
        newErrors[`medicines.${index}.dosage`] = 'Dosage is required';
      } else if (medicine.dosage.length > 50) {
        newErrors[`medicines.${index}.dosage`] = 'Dosage must be less than 50 characters';
      }

      if (!medicine.frequency.trim()) {
        newErrors[`medicines.${index}.frequency`] = 'Frequency is required';
      } else if (medicine.frequency.length > 50) {
        newErrors[`medicines.${index}.frequency`] = 'Frequency must be less than 50 characters';
      }

      if (medicine.duration && medicine.duration.length > 50) {
        newErrors[`medicines.${index}.duration`] = 'Duration must be less than 50 characters';
      }

      if (medicine.notes && medicine.notes.length > 300) {
        newErrors[`medicines.${index}.notes`] = 'Medicine notes must be less than 300 characters';
      }
    });

    // Validate general notes
    if (formData.notes && formData.notes.length > 1000) {
      newErrors.notes = 'Notes must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Filter out empty medicines
      const validMedicines = formData.medicines.filter(medicine => 
        medicine.name.trim() && medicine.dosage.trim() && medicine.frequency.trim()
      );

      const submissionData = {
        ...formData,
        medicines: validMedicines,
        prescribedAt: new Date().toISOString()
      };

      await onSubmit(submissionData);
    } catch (error) {
      console.error('Error submitting diagnosis:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600/20 to-green-600/20 p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Pill className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Patient Diagnosis</h2>
                <p className="text-gray-300 text-sm">
                  Patient: {patient?.bookedBy?.name} | ID: {patient?.bookedBy?._id}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Patient Info Display */}
            <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50">
              <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-400" />
                Patient Information
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Name:</span>
                  <p className="text-white font-medium">{patient?.bookedBy?.name}</p>
                </div>
                <div>
                  <span className="text-gray-400">Age:</span>
                  <p className="text-white font-medium">{patient?.age}</p>
                </div>
                <div>
                  <span className="text-gray-400">Contact:</span>
                  <p className="text-white font-medium">{patient?.contact}</p>
                </div>
                <div>
                  <span className="text-gray-400">Time Slot:</span>
                  <p className="text-white font-medium">{patient?.timeSlot}</p>
                </div>
                <div>
                  <span className="text-gray-400">Date:</span>
                  <p className="text-white font-medium">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Medicines Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white flex items-center">
                  <Pill className="w-5 h-5 mr-2 text-green-400" />
                  Prescribed Medicines
                </h3>
                <button
                  type="button"
                  onClick={addMedicine}
                  className="flex items-center cursor-pointer space-x-2 px-3 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors border border-green-600/50"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Medicine</span>
                </button>
              </div>

              {formData.medicines.map((medicine, index) => (
                <div key={index} className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-medium">Medicine {index + 1}</h4>
                    {formData.medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedicine(index)}
                        className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Medicine Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Medicine Name *
                      </label>
                      <input
                        type="text"
                        value={medicine.name}
                        onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                        placeholder="Enter medicine name"
                        maxLength={100}
                        className={`w-full px-3 py-2 bg-gray-950 border rounded-lg text-white focus:outline-none focus:border-blue-500 ${
                          errors[`medicines.${index}.name`] ? 'border-red-500' : 'border-gray-600'
                        }`}
                      />
                      {errors[`medicines.${index}.name`] && (
                        <p className="text-red-400 text-xs mt-1 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors[`medicines.${index}.name`]}
                        </p>
                      )}
                    </div>

                    {/* Dosage */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Dosage *
                      </label>
                      <input
                        type="text"
                        value={medicine.dosage}
                        onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                        placeholder="e.g., 500mg, 2 tablets"
                        maxLength={50}
                        className={`w-full px-3 py-2 bg-gray-950 border rounded-lg text-white focus:outline-none focus:border-blue-500 ${
                          errors[`medicines.${index}.dosage`] ? 'border-red-500' : 'border-gray-600'
                        }`}
                      />
                      {errors[`medicines.${index}.dosage`] && (
                        <p className="text-red-400 text-xs mt-1 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors[`medicines.${index}.dosage`]}
                        </p>
                      )}
                    </div>

                    {/* Frequency */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Frequency *
                      </label>
                      <select
                        value={medicine.frequency}
                        onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                        className={`w-full px-3 py-2 bg-gray-950 border rounded-lg text-white focus:outline-none focus:border-blue-500 ${
                          errors[`medicines.${index}.frequency`] ? 'border-red-500' : 'border-gray-600'
                        }`}
                      >
                        <option value="">Select frequency</option>
                        {frequencyOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors[`medicines.${index}.frequency`] && (
                        <p className="text-red-400 text-xs mt-1 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors[`medicines.${index}.frequency`]}
                        </p>
                      )}
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Duration
                      </label>
                      <select
                        value={medicine.duration}
                        onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="">Select duration</option>
                        {durationOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Medicine Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Medicine Notes
                    </label>
                    <textarea
                      value={medicine.notes}
                      onChange={(e) => updateMedicine(index, 'notes', e.target.value)}
                      placeholder="Special instructions for this medicine..."
                      maxLength={300}
                      rows={2}
                      className={`w-full px-3 py-2 bg-gray-950 border rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none ${
                        errors[`medicines.${index}.notes`] ? 'border-red-500' : 'border-gray-600'
                      }`}
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors[`medicines.${index}.notes`] && (
                        <p className="text-red-400 text-xs flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors[`medicines.${index}.notes`]}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 ml-auto">
                        {medicine.notes.length}/300
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* General Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                General Notes & Instructions
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => updateNotes(e.target.value)}
                placeholder="Additional notes, follow-up instructions, dietary recommendations, etc..."
                maxLength={1000}
                rows={4}
                className={`w-full px-3 py-2 bg-gray-950 border rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none ${
                  errors.notes ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.notes && (
                  <p className="text-red-400 text-xs flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.notes}
                  </p>
                )}
                <p className="text-xs text-gray-500 ml-auto">
                  {formData.notes.length}/1000
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-800/30 p-4 border-t border-gray-700">
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white cursor-pointer font-medium rounded-lg transition-all duration-200 ${
                isSubmitting
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:from-emerald-700 hover:to-emerald-900 active:scale-95'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Prescription</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisForm;