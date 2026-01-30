import React, { useState } from 'react';
import { User, Phone, Stethoscope, ChevronRight, ArrowLeft, Search, X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { addDoctorByHospital } from '../services/hospitalsServices';

const DrPatientsListByHospital = ({ data = [] }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [search, setSearch] = useState("")
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newDoctor, setNewDoctor] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    gender: 'male',
    specialization: '',
    experience: '',
    licenseNumber: '',
    education: '',
    consultationFee: ''
  });

  const selectDoctor = (doctor) => setSelectedDoctor(doctor)
  const backToDoctors = () => setSelectedDoctor(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor(prev => ({ ...prev, [name]: value }));
  };

  const handleAddDoctorSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await addDoctorByHospital(newDoctor);
      if (response.success) {
        toast.success("Doctor added successfully!");
        setIsAddDoctorModalOpen(false);
        setNewDoctor({
          name: '',
          email: '',
          phone: '',
          password: '',
          gender: 'male',
          specialization: '',
          experience: '',
          licenseNumber: '',
          education: '',
          consultationFee: ''
        });
        // Ideally trigger a refresh of the list here
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add doctor.");
    } finally {
      setLoading(false);
    }
  };


  const filteredDoctors = data.filter((doctor) =>
    doctor.doctorName.toLowerCase().includes(search.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className=" bg-gray-950">
      <div className="max-w-7xl mx-auto">
        {/* Doctors View */}
        {!selectedDoctor && (
          <div >
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Medical Directory
                </h1>
                <div className="h-1 mt-2 w-65 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </div>

              {/* Search and Add Doctor */}
              <div className="flex gap-4 w-full md:w-auto">
                <div className="relative max-w-md w-full md:w-80">
                  <input
                    type="text"
                    placeholder="Search by doctor name or specialization..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute left-3 top-3 text-gray-500 h-5 w-5" />
                </div>
                <button
                  onClick={() => setIsAddDoctorModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden md:inline">Add Doctor</span>
                </button>
              </div>
            </div>

            {/* Doctors Grid */}
            {filteredDoctors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center mb-6">
                  <Stethoscope className="h-10 w-10 text-gray-500" />
                </div>
                <p className="text-gray-500 text-lg">No doctors found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor) => (
                  <div
                    key={doctor.doctorId}
                    onClick={() => selectDoctor(doctor)}
                    className="group relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 cursor-pointer transition-all duration-500 hover:border-gray-600 hover:shadow-2xl hover:shadow-blue-500/10"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-5">
                        <Stethoscope className="h-7 w-7 text-white" />
                      </div>
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
                          {doctor.doctorName}
                        </h3>
                        <p className="text-sm text-gray-400">{doctor.specialization}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {doctor.patients?.length || 0} patient{doctor.patients?.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-2 mb-4">
                        <p className="text-gray-500 text-xs">Doctor ID</p>
                        <p className="text-gray-300 font-mono text-xs break-all">{doctor.doctorId}</p>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>View patients</span>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Patients View */}
        {selectedDoctor && (
          <div className="min-h-screen">

            <button
              onClick={backToDoctors}
              className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6 transition-colors group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Doctors</span>
            </button>
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Stethoscope className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {selectedDoctor.specialization}
                </h1>
                <p className="text-gray-400 text-sm">
                  {selectedDoctor.patients?.length || 0} patient{selectedDoctor.patients?.length !== 1 ? 's' : ''}
                </p>
              </div>

            </div>

            {/* Patient List */}
            <div className="p-6">
              {selectedDoctor.patients?.length > 0 ? (
                <div className="grid gap-4">
                  {selectedDoctor.patients.map((patient) => (
                    <div
                      key={patient._id}
                      className="group bg-gradient-to-r from-gray-900 to-gray-900/50 border border-gray-800 rounded-xl p-4 hover:border-gray-600 transition-all"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-300" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-white mb-1">
                            {patient.name}
                          </h3>
                          <div className="text-gray-400 text-sm flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>{patient.phone}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                            <div>
                              <p className="text-gray-500 text-xs">Patient ID</p>
                              <p className="text-gray-400 text-xs font-mono break-all">{patient._id}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs">User ID</p>
                              <p className="text-gray-400 text-xs font-mono break-all">{patient.userId}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                    <User className="h-8 w-8 text-gray-500" />
                  </div>
                  <p className="text-gray-500 text-base">No patients assigned</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Doctor Modal */}
      {isAddDoctorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
              <h2 className="text-2xl font-bold text-white">Add New Doctor</h2>
              <button
                onClick={() => setIsAddDoctorModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddDoctorSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Full Name</label>
                  <input
                    required
                    name="name"
                    value={newDoctor.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Dr. John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Email Address</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={newDoctor.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="doctor@hospital.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Phone</label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={newDoctor.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. 9876543210"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Password</label>
                  <input
                    required
                    type="password"
                    name="password"
                    value={newDoctor.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Create a password"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Gender</label>
                  <select
                    name="gender"
                    value={newDoctor.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Specialization</label>
                  <input
                    required
                    name="specialization"
                    value={newDoctor.specialization}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. Cardiologist"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Experience (Years)</label>
                  <input
                    type="number"
                    name="experience"
                    value={newDoctor.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. 10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">License Number</label>
                  <input
                    required
                    name="licenseNumber"
                    value={newDoctor.licenseNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Medical License No."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Education</label>
                  <input
                    required
                    name="education"
                    value={newDoctor.education}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. MBBS, MD"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Consultation Fee (₹)</label>
                  <input
                    required
                    type="number"
                    name="consultationFee"
                    value={newDoctor.consultationFee}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. 500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsAddDoctorModalOpen(false)}
                  className="px-6 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding Doctor...' : 'Add Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default DrPatientsListByHospital
