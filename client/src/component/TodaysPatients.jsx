import React, { useState } from 'react';
import {
    User,
    Calendar,
    Clock,
    Search,
    ArrowRight,
    Phone,
    MapPin,
    Stethoscope,
    Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TodaysPatients = ({ patients = [] }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    // Filter patients based on search
    const filteredPatients = patients.filter((patient) => {
        const name = patient.name?.toLowerCase() || "";
        const doctor = patient.doctorName?.toLowerCase() || "";
        const term = searchTerm.toLowerCase();

        return name.includes(term) || doctor.includes(term);
    });

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'booked': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'cancelled': return 'text-red-400 bg-red-500/10 border-red-500/20';
            default: return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Activity className="h-6 w-6 text-blue-500" />
                        Today's Appointments
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                        {filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''} scheduled for today
                    </p>
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search patient or doctor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {filteredPatients.length === 0 ? (
                <div className="text-center py-16 bg-gray-900/30 rounded-2xl border border-gray-800">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="h-8 w-8 text-gray-500" />
                    </div>
                    <h3 className="text-white font-medium text-lg">No Appointments Today</h3>
                    <p className="text-gray-400 mt-2">There are no patients scheduled for today.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredPatients.map((patient, index) => (
                        <div
                            key={patient.appointmentId || index}
                            className="bg-gray-900/50 hover:bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-5 transition-all duration-300 group"
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-6">

                                {/* Time & Status */}
                                <div className="flex md:flex-col items-center md:items-start gap-3 md:gap-1 min-w-[100px]">
                                    <div className="flex items-center gap-2 text-white font-semibold text-lg">
                                        <Clock className="h-5 w-5 text-blue-400" />
                                        {new Date(patient.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(patient.status)}`}>
                                        {patient.status}
                                    </span>
                                </div>

                                {/* Patient Info */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                                                {patient.name}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-400">
                                                <div className="flex items-center gap-1.5">
                                                    <User className="h-4 w-4" />
                                                    {patient.gender}, {patient.age} yrs
                                                </div>
                                                {patient.phone && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Phone className="h-4 w-4" />
                                                        {patient.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Doctor Info */}
                                <div className="flex-1 md:border-l md:border-gray-800 md:pl-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-gray-800 flex items-center justify-center">
                                            <Stethoscope className="h-5 w-5 text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Doctor</p>
                                            <p className="text-gray-200 font-medium">{patient.doctorName}</p>
                                            <p className="text-xs text-blue-400">{patient.specialization}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="flex items-center justify-end">
                                    <button
                                        className="p-3 rounded-lg bg-gray-800 text-gray-300 hover:text-white hover:bg-blue-600 transition-colors"
                                        title="View Details"
                                        onClick={() => navigate(`/hospital/patient/${patient.patientId || patient.userId}`)}
                                    >
                                        <ArrowRight className="h-5 w-5" />
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TodaysPatients;
