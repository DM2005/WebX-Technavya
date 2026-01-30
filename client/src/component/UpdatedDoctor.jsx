import React from 'react'
import {

  Stethoscope,
  Phone,
  Mail,
  MapPin,
  Edit,
  Star,
} from 'lucide-react'

export const UpdatedDoctor = ({ doctorInfo }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">My Profile</h2>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture and Basic Info */}
          <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600/30">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">{doctorInfo.name}</h3>
              <p className="text-blue-400 font-medium">{doctorInfo.specialty}</p>
              <p className="text-gray-400 text-sm mt-1">ID: {doctorInfo.id}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600/30">
            <h4 className="text-lg font-semibold text-white mb-4">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">{doctorInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">{doctorInfo.email}</span>
              </div>

            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600/30">
            <h4 className="text-lg font-semibold text-white mb-4">Professional Details</h4>
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm">Experience</p>
                <p className="text-white font-medium">{doctorInfo.experience}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Education</p>
                <p className="text-white font-medium">{doctorInfo.education}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">License Number</p>
                <p className="text-white font-medium">{doctorInfo.license}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-500/30">
            <h5 className="text-blue-400 font-medium">Total Reviews</h5>
            <p className="text-2xl font-bold text-white">{doctorInfo.totalReviews}</p>
          </div>
          <div className="bg-green-500/20 p-4 rounded-lg border border-green-500/30">
            <h5 className="text-green-400 font-medium">Average Rating</h5>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-white">{doctorInfo.averageRating}</p>
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
            </div>
          </div>
          <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-500/30">
            <h5 className="text-purple-400 font-medium">Specializations</h5>
            <p className="text-2xl font-bold text-white">{doctorInfo.specialty}</p>
          </div>
          <div className="bg-yellow-500/20 p-4 rounded-lg border border-yellow-500/30">
            <h5 className="text-yellow-400 font-medium">Years Experience</h5>
            <p className="text-2xl font-bold text-white">{doctorInfo.experience}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

