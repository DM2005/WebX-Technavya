import React, { useState, useEffect } from "react";
import {
  User,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  Search,
  Plus,
  X,
  Stethoscope
} from "lucide-react";
import { toast } from 'sonner';
import { addAssistantByHospital, getAllDoctorsbyHospitals } from '../services/hospitalsServices';
import { getHospital } from '../services/hospitalsServices'; // Assuming we need to get hospital ID/profile to fetch doctors

const AllAssistants = ({ data = [], onAssistantAdded }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);

  const [newAssistant, setNewAssistant] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    doctorId: ''
  });

  // Fetch doctors for the dropdown when modal opens
  useEffect(() => {
    if (isAddModalOpen) {
      fetchDoctors();
    }
  }, [isAddModalOpen]);

  const fetchDoctors = async () => {
    try {
      // First get hospital profile to get the ID
      const profileRes = await getHospital();
      if (profileRes && profileRes.hospital) {
        const hospitalId = profileRes.hospital._id;
        const response = await getAllDoctorsbyHospitals(hospitalId);
        if (response && response.doctors) {
          setDoctors(response.doctors);
        }
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Failed to load doctors list.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssistant(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newAssistant.doctorId) {
      toast.error("Please select a doctor to assign the assistant to.");
      return;
    }

    setLoading(true);
    try {
      const response = await addAssistantByHospital(newAssistant);
      if (response.success) {
        toast.success("Assistant added successfully!");
        setIsAddModalOpen(false);
        setNewAssistant({
          name: '',
          email: '',
          phone: '',
          password: '',
          doctorId: ''
        });

        if (onAssistantAdded) {
          onAssistantAdded();
        } else {
          window.location.reload();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add assistant.");
    } finally {
      setLoading(false);
    }
  };

  // Filter assistants based on name/email of assistant or doctor
  const filteredData = (data || []).filter((assistant) => {
    const assistantName = assistant?.userId?.name?.toLowerCase() || "";
    const assistantEmail = assistant?.userId?.email?.toLowerCase() || "";
    const doctorName = assistant?.doctorId?.userId?.name?.toLowerCase() || "";
    const doctorEmail = assistant?.doctorId?.userId?.email?.toLowerCase() || "";

    const term = searchTerm.toLowerCase();
    return (
      assistantName.includes(term) ||
      assistantEmail.includes(term) ||
      doctorName.includes(term) ||
      doctorEmail.includes(term)
    );
  });

  return (
    <div className="p-6 bg-gray-950 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header and Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-white">All Assistants</h1>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by assistant or doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
              />
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Add Assistant
            </button>
          </div>
        </div>

        {/* Assistant List */}
        {filteredData.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/30 rounded-2xl border border-gray-800">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10 text-gray-500" />
            </div>
            <p className="text-gray-400 text-lg">No assistants found</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredData.map((assistant, index) => (
              <div
                key={assistant._id || index}
                className="bg-gray-900/50 rounded-xl shadow-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Assistant Info */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-400" />
                        Assistant Details
                      </h2>
                      <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700">
                        {assistant.isVerified ? (
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span
                          className={`text-xs font-medium ${assistant.isVerified
                              ? "text-emerald-400"
                              : "text-red-400"
                            }`}
                        >
                          {assistant.isVerified ? "Verified" : "Pending"}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 space-y-3">
                      <div>
                        <p className="font-medium text-white text-lg">
                          {assistant.userId?.name || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500 font-mono mt-1">
                          ID: {assistant._id}
                        </p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-gray-700/50">
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                          <Mail className="h-4 w-4 text-gray-500" />
                          {assistant.userId?.email || "N/A"}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                          <Phone className="h-4 w-4 text-gray-500" />
                          {assistant.userId?.phone || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Stethoscope className="h-5 w-5 text-purple-400" />
                      Assigned Doctor
                    </h3>

                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 space-y-3">
                      <div>
                        <p className="font-medium text-white text-lg">
                          {assistant.doctorId?.userId?.name || "Unassigned"}
                        </p>
                        <p className="text-xs text-gray-500 font-mono mt-1">
                          ID: {assistant.doctorId?._id}
                        </p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-gray-700/50">
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                          <Mail className="h-4 w-4 text-gray-500" />
                          {assistant.doctorId?.userId?.email || "N/A"}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm pt-1">
                          <div>
                            <span className="text-xs text-gray-500 block">Specialization</span>
                            <span className="text-gray-300">{assistant.doctorId?.specialization || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Assistant Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">Add New Assistant</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Full Name</label>
                <input
                  required
                  name="name"
                  value={newAssistant.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email Address</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={newAssistant.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500"
                  placeholder="assistant@hospital.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Phone</label>
                <input
                  required
                  type="tel"
                  name="phone"
                  value={newAssistant.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500"
                  placeholder="9876543210"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Password</label>
                <input
                  required
                  type="password"
                  name="password"
                  value={newAssistant.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Assign to Doctor</label>
                <div className="relative">
                  <select
                    required
                    name="doctorId"
                    value={newAssistant.doctorId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
                  >
                    <option value="">Select a Doctor</option>
                    {doctors.map((doc) => (
                      <option key={doc.doctorId} value={doc.doctorId}>
                        {doc.name} - {doc.specialization}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding...' : 'Add Assistant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAssistants;
