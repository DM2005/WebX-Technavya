import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader, ArrowLeft, Phone, Mail } from 'lucide-react';
import MedicalRecordPatient from '../component/MedicalRecordPatient';

const baseUrl = import.meta.env.VITE_API_URL;

const PatientDetails = () => {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [patientProfile, setPatientProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch medical records
                const recordsRes = await axios.get(`${baseUrl}/api/doctor/medicine/${patientId}/self`, {
                    withCredentials: true
                });

                if (recordsRes.data && recordsRes.data.records) {
                    setMedicalRecords(recordsRes.data.records);
                }

                // Fetch patient profile
                const profileRes = await axios.get(`${baseUrl}/api/doctor/patient-profile/${patientId}`, {
                    withCredentials: true
                });

                if (profileRes.data && profileRes.data.patient) {
                    setPatientProfile(profileRes.data.patient);
                }

            } catch (err) {
                console.error("Error fetching patient data:", err);
                const msg = err.response?.data?.error || err.message || "Failed to load patient data.";
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        if (patientId) {
            fetchData();
        }
    }, [patientId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
                <Loader className="animate-spin w-8 h-8 text-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 p-6">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Dashboard
                </button>

                {error ? (
                    <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800">
                        <p className="text-red-400">{error}</p>
                    </div>
                ) : (
                    <>
                        {/* Patient Profile Section */}
                        {patientProfile && (
                            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-8 backdrop-blur-sm">
                                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-blue-500/20">
                                            {patientProfile.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white mb-1">{patientProfile.name}</h2>
                                            <div className="flex flex-wrap gap-4 text-gray-400 text-sm">
                                                {patientProfile.phone && (
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="p-1 bg-gray-800 rounded-md"><Phone className="w-3 h-3" /></span>
                                                        {patientProfile.phone}
                                                    </div>
                                                )}
                                                {patientProfile.email && (
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="p-1 bg-gray-800 rounded-md"><Mail className="w-3 h-3" /></span>
                                                        {patientProfile.email}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Vitals Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full md:w-auto">
                                        <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700/50">
                                            <p className="text-xs text-gray-400 mb-1">Blood Pressure</p>
                                            <p className="text-white font-medium">{patientProfile.bloodPressure || '--'}</p>
                                        </div>
                                        <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700/50">
                                            <p className="text-xs text-gray-400 mb-1">Heart Rate</p>
                                            <p className="text-white font-medium">{patientProfile.heartRate || '--'} <span className="text-xs text-gray-500">bpm</span></p>
                                        </div>
                                        <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700/50">
                                            <p className="text-xs text-gray-400 mb-1">Oxygen</p>
                                            <p className="text-white font-medium">{patientProfile.oxygenLevel || '--'} <span className="text-xs text-gray-500">%</span></p>
                                        </div>
                                        <div className="bg-gray-800/50 p-3 rounded-xl border border-gray-700/50">
                                            <p className="text-xs text-gray-400 mb-1">Temp</p>
                                            <p className="text-white font-medium">{patientProfile.temperature || '--'} <span className="text-xs text-gray-500">°F</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <MedicalRecordPatient medicalRecord={medicalRecords} />
                    </>
                )}
            </div>
        </div>
    );
};

export default PatientDetails;
