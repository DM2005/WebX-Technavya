import React, { useState } from 'react';
import { Video, Clock, User, Calendar, Phone, FileText, CloudSnow } from 'lucide-react';
import VideoCall from './VideoCall';

const DoctorOnlinePatients = ({ onlineAppointments = [], name }) => {
  const [activeCall, setActiveCall] = useState(null);
  
  console.log(onlineAppointments);

  const handleJoinCall = (appointment , name) => {

    setActiveCall({
      callId: appointment,
      name: name
    });
    
  };

  const handleEndCall = () => {
    setActiveCall(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'booked':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  if (activeCall) {
    return (
      <div>
        <VideoCall 
          callId= {activeCall.callId}
          name={name}
          role='doctor'
        />
      </div>
    );
  }

  if (!onlineAppointments || onlineAppointments.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Online Patients</h1>
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No online appointments scheduled</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Online Patients</h1>
          <p className="text-gray-400">Welcome back, Dr. {name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {onlineAppointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-gray-800 rounded-xl border border-gray-700 hover:border-emerald-500 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {appointment.bookedBy?.name || 'Patient Name'}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {appointment.bookedBy?.email}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                    {appointment.status?.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Patient Details */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-emerald-400" />
                    <div>
                      <p className="text-xs text-gray-400">Age</p>
                      <p className="text-white font-medium">{appointment.age} years</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <div>
                      <p className="text-xs text-gray-400">Gender</p>
                      <p className="text-white font-medium capitalize">{appointment.gender}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="text-xs text-gray-400">Contact</p>
                    <p className="text-white font-medium">{appointment.contact}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="text-white font-medium">{formatDate(appointment.date)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="text-xs text-gray-400">Time Slot</p>
                    <p className="text-white font-medium">{appointment.timeSlot}</p>
                  </div>
                </div>

                {appointment.forPatient?.type && (
                  <div className="bg-gray-700 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Appointment Type</p>
                    <p className="text-white font-medium capitalize">
                      {appointment.forPatient.type === 'self' ? 'Self Consultation' : appointment.forPatient.type}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => handleJoinCall(appointment._id, appointment.bookedBy?.name)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 group"
                  disabled={appointment.status?.toLowerCase() !== 'booked'}
                >
                  <Video className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Join Call</span>
                </button>
                
                {appointment.status?.toLowerCase() !== 'booked' && (
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Call only available for booked appointments
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorOnlinePatients;