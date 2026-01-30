
import React, { useState , useEffect } from 'react';
import { Calendar, Clock,Loader, User, Phone, Video, MapPin } from 'lucide-react';
import VideoCall from './VideoCall';

// VideoCall component placeholder - replace with your actual VideoCall component



const LiveComponentPatient = ({ onlineAppointment, name  }) => {
  const [activeCall, setActiveCall] = useState(null);
  const [loading , setLoading] = useState(true);
  


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


      useEffect(() => {
    if (onlineAppointment.length > 0) {
      setLoading(false);
    }
  }, [onlineAppointment]);

  const handleJoinCall = (appointment) => {
    console.log(appointment._id)
    setActiveCall({
      callId: appointment._id,
      name : appointment.bookedBy.name
    });
  };

  const handleEndCall = () => {
    setActiveCall(null);
  };

  if (activeCall) {
    return (
      <div>
        
        <VideoCall 
          callId={activeCall.callId}
          name = {name}
          role = 'patients'
        />
        
      </div>
    );
  }



      if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center text-white flex flex-col items-center">
          <Loader className="w-8 h-8 animate-spin text-emerald-400 mb-3" />
          <p className="text-lg">Loading onlineAppointment ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Your Online Appointments
        </h1>
        
        {!onlineAppointment || onlineAppointment.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <Video size={64} className="mx-auto mb-4 opacity-50" />
            <p className="text-xl">No online appointments scheduled</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {onlineAppointment.map((appointment) => (
              <div 
                key={appointment._id}
                className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:bg-gray-750 transition-all duration-300 hover:border-green-500 hover:shadow-lg hover:shadow-green-500/20"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-semibold text-sm uppercase tracking-wide">
                      {appointment.mode}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    appointment.status === 'booked' 
                      ? 'bg-green-900 text-green-300 border border-green-600' 
                      : 'bg-gray-700 text-gray-300'
                  }`}>
                    {appointment.status}
                  </span>
                </div>

                {/* Doctor Info */}
                <div className="mb-4">
                  <h3 className="text-white text-lg font-semibold mb-1">
                    Dr. {appointment.doctorId?.userId?.name}
                  </h3>
                  <p className="text-green-400 text-sm font-medium">
                    {appointment.doctorId?.specialization}
                  </p>
                </div>

                {/* Hospital Info */}
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin size={16} className="text-gray-400" />
                  <div>
                    <p className="text-white text-sm font-medium">
                      {appointment.hospitalId?.name}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {appointment.hospitalId?.address}
                    </p>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <Calendar size={16} className="text-green-400" />
                    <span className="text-gray-300 text-sm">
                      {formatDate(appointment.date)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock size={16} className="text-green-400" />
                    <span className="text-gray-300 text-sm">
                      {appointment.timeSlot}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <User size={16} className="text-green-400" />
                    <span className="text-gray-300 text-sm">
                      Age: {appointment.age}, {appointment.gender}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone size={16} className="text-green-400" />
                    <span className="text-gray-300 text-sm">
                      {appointment.contact}
                    </span>
                  </div>
                </div>

                {/* Join Call Button */}
                <button
                  onClick={() => handleJoinCall(appointment)}
                  className="w-full cursor-pointer bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-black font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-green-500/25"
                >
                  <Video size={20} />
                  <span>Join Call</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveComponentPatient;