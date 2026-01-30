import { useEffect, useState } from "react";
import axios from "axios"; // or your API utility

export default function RecentAdmissions({ totalAppointments }) {

  return (
    <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
      <h3 className="text-xl font-semibold text-white mb-4">Recent Admissions</h3>
      <div className="space-y-3">
        {totalAppointments.map((appt) => (
          <div key={appt._id} className="bg-gray-700/30 p-3 rounded-lg border border-gray-600/30">
            <div className="flex items-center justify-between">
              <div>
                {/* Use patient name if available */}
                <h4 className="font-medium text-white">{appt.bookedBy?.name || "Unknown"}</h4>
                <p className="text-gray-400 text-sm">{appt.testDetails?.testName || "No test"}</p>
              </div>
              <div className="text-right">
                <p className="text-blue-400 text-sm">{new Date(appt.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  appt.status === 'Completed' ? 'bg-green-400/20 text-green-400' :
                  appt.status === 'In Progress' ? 'bg-yellow-400/20 text-yellow-400' :
                  'bg-blue-400/20 text-blue-400'
                }`}>
                  {appt.status}
                </span>
              </div>
            </div>
          </div>
        ))}
        {totalAppointments.length === 0 && (
          <div className="text-gray-400 text-center">No admissions today.</div>
        )}
      </div>
    </div>
  );
}
