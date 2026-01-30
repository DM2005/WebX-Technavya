import React, { useEffect, useState } from 'react';
import { MapPin, Clock, Phone, Calendar, Search, ChevronLeft, Loader, FileText, Compass, User, Filter, ArrowDown, Star } from 'lucide-react';
import { toast } from "sonner"
import { createAppointmentLab } from "../services/patientServices"

const LabAppointmentBooking = ({ labs = [] }) => {
  const [selectedLab, setSelectedLab] = useState(null);
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState("ratingHighLow");
  const [formData, setFormData] = useState({
    testName: '',
    testType: '',
    date: '',
    time: '',
    notes: '',
    forPatientType: 'self'
  });


  useEffect(() => {
    if (labs.length > 0) {
      setLoading(false);
    }
  }, [labs]);

  const handleLabSelect = (lab) => setSelectedLab(lab);

  const handleBack = () => {
    setSelectedLab(null);
    setFormData({
      testName: '',
      testType: '',
      date: '',
      time: '',
      notes: '',
      forPatientType: 'self'
    });
  };

  const filteredLabs = labs.filter(lab =>
    (lab.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lab.address || '').toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (sortOption === "ratingHighLow") {
      return (b.averageRating || 0) - (a.averageRating || 0);
    }
    if (sortOption === "priceLowHigh") {
      return (a.averagePrice || 0) - (b.averagePrice || 0);
    }
    if (sortOption === "priceHighLow") {
      return (b.averagePrice || 0) - (a.averagePrice || 0);
    }
    return 0;
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBookTest = async () => {
    if (!formData.testName || !formData.testType || !formData.date || !formData.time) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const appointmentData = {
        forPatientType: formData.forPatientType,
        labId: selectedLab._id,
        testDetails: {
          testName: formData.testName,
          testType: formData.testType,
        },
        scheduledDate: formData.date,
        timeSlot: formData.time,
        notes: formData.notes || undefined,
      };

      // console.log('Booking appointment with data:', appointmentData);



      const response = await createAppointmentLab(appointmentData);
      if (response?.success) {
        toast.success("Lab Book Successfully 🧪")
        console.log(response)
      }

      // Uncomment and implement your API call here
      // const response = await bookLabAppointment(appointmentData);
      // if (response.success) {
      //   alert('Lab test booked successfully!');
      //   handleBack();
      // } else {
      //   alert('Failed to book appointment. Please try again.');
      // }

      alert('Lab test booked successfully!');
      handleBack();
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center text-white flex flex-col items-center">
          <Loader className="w-8 h-8 animate-spin text-emerald-400 mb-3" />
          <p className="text-lg">Loading nearby Labs...</p>
        </div>
      </div>
    );
  }

  if (!labs || labs.length === 0) {
    return <p className="text-white text-center mt-8">No Labs Available</p>;
  }

  return (
    <div>
      {!selectedLab ? (
        <>
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-emerald-100 to-blue-100 bg-clip-text text-transparent mb-4">
              Nearby Labs
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Select a lab for checkups
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full mx-auto mt-4" />
          </div>
          <div className="max-w-3xl mx-auto mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-emerald-700" />
              </div>
              <input
                type="text"
                placeholder="Search labs by name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800/40  border border-gray-700/30 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300"
              />
            </div>

            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-blue-400" />
              </div>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full appearance-none bg-gray-800/40 border border-gray-700/30 rounded-2xl pl-12 pr-10 py-4 text-white focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 cursor-pointer hover:bg-gray-800/60"
              >
                <option value="ratingHighLow">Highest Rated</option>
                <option value="priceLowHigh">Price: Low - High</option>
                <option value="priceHighLow">Price: High - Low</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                <ArrowDown className="h-4 w-4" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLabs.map((lab) => (
              <div
                key={lab._id}
                className="group relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8 hover:bg-gradient-to-br hover:from-gray-800/60 hover:to-gray-900/80 transition-all duration-500 cursor-pointer transform hover:scale-[1.02] hover:border-emerald-400/50 hover:shadow-2xl hover:shadow-emerald-500/10"
                onClick={() => handleLabSelect(lab)}
              >
                {/* Gradient overlay for premium effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content */}
                <div className="relative z-10">
                  {/* Lab name with premium styling */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-emerald-50 transition-colors duration-300">
                      {lab.name}
                    </h3>
                  </div>

                  {/* Info items with enhanced styling */}
                  <div className="space-y-4">
                    {/* Address */}
                    <div className="flex items-start text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                      <div className="flex-shrink-0 w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-emerald-500/20 transition-all duration-300">
                        <MapPin className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="flex-1 pt-2">
                        <p className="text-sm font-medium leading-relaxed">{lab.address}</p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-purple-500/20 transition-all duration-300">
                        <Phone className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1 pt-2">
                        <p className="text-sm font-medium">{lab.phone}</p>
                      </div>
                    </div>

                    {/* Distance */}
                    <div className="flex items-center text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-500/20 transition-all duration-300">
                        <Compass className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="flex-1 pt-2">
                        <p className="text-sm font-medium">
                          {(lab.distance / 1000).toFixed(2)} km away
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating & Price Badge */}
                <div className="absolute bottom-6 right-6 z-20 flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1.5 bg-gray-900/80 backdrop-blur border border-gray-700/50 px-3 py-1.5 rounded-full shadow-lg">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                    <span className="text-white font-bold text-xs">
                      {lab.averageRating ? lab.averageRating.toFixed(1) : 'New'}
                    </span>
                  </div>
                  <div className="bg-emerald-900/80 backdrop-blur border border-emerald-700/50 px-2 py-1 rounded-md shadow-lg">
                    <span className="text-emerald-400 font-bold text-xs">
                      ~₹{lab.averagePrice || 500}
                    </span>
                  </div>
                </div>

                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-blue-500/0 opacity-0 group-hover:opacity-200 transition-opacity duration-500 blur-2xl" />
              </div>
            ))}
          </div>

          {/* No results message */}
          {searchTerm && filteredLabs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No labs found</h3>
                <p>No labs match your search for "{searchTerm}"</p>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
          <button onClick={handleBack} className="flex items-center text-gray-300 hover:text-white mb-6">
            <ChevronLeft className="w-5 h-5 mr-1" /> Back to Labs
          </button>

          <h2 className="text-2xl text-white font-bold mb-4">{selectedLab.name}</h2>
          <p className="text-gray-400 mb-6">{selectedLab.address}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient Type Selection */}
            <div>
              <label className="block text-gray-300 mb-2">
                <User className="inline w-4 h-4 mr-1" />
                Booking For *
              </label>
              <select
                value={formData.forPatientType}
                onChange={(e) => handleInputChange('forPatientType', e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white"
              >
                <option value="self">Self</option>
                <option value="familyMember">Family Member</option>
              </select>
            </div>

            {/* Test Name */}
            <div>
              <label className="block text-gray-300 mb-2">
                <FileText className="inline w-4 h-4 mr-1" />
                Test Name *
              </label>
              <input
                type="text"
                value={formData.testName}
                onChange={(e) => handleInputChange('testName', e.target.value)}
                placeholder="Enter test name (e.g., Complete Blood Count)"
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400"
              />
            </div>

            {/* Test Type */}
            <div>
              <label className="block text-gray-300 mb-2">
                <FileText className="inline w-4 h-4 mr-1" />
                Test Type *
              </label>
              <select
                value={formData.testType}
                onChange={(e) => handleInputChange('testType', e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white"
              >
                <option value="">Choose a test...</option>
                {selectedLab.testTypes?.map((test, index) => (
                  <option key={index} value={test}>
                    {test}
                  </option>
                ))}
              </select>

            </div>

            {/* Date */}
            <div>
              <label className="block text-gray-300 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Preferred Date *
              </label>
              <input
                type="date"
                value={formData.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white"
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-gray-300 mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Preferred Time *
              </label>
              <select
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white"
              >
                <option value="">Choose time...</option>
                <option value="8:00 AM">8:00 AM</option>
                <option value="9:00 AM">9:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="1:00 PM">1:00 PM</option>
                <option value="2:00 PM">2:00 PM</option>
                <option value="3:00 PM">3:00 PM</option>
                <option value="4:00 PM">4:00 PM</option>
                <option value="5:00 PM">5:00 PM</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-6">
            <label className="block text-gray-300 mb-2">Additional Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any special instructions or requirements..."
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400"
              rows="2"
            />
          </div>

          <button
            onClick={handleBookTest}
            className="mt-6 flex bg-gradient-to-r from-green-600 to-green-500 text-black font-bold 
            px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-600 border border-green-500/30
             transition-all duration-300 hover:shadow-green-500/30 hover:scale-105"
          >
            <Calendar className="w-4 h-4 mr-2 mt-1 text-black font-bold" />
            Book Lab Test
          </button>
        </div>
      )}
    </div>
  );
};

export { LabAppointmentBooking };