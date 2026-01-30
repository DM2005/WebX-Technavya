import React, { useState, useEffect } from 'react';
import {
  Home,
  Users,
  User,
  Bell,
  Clock,
  Search,
  Stethoscope,
  LogOut,
  Phone,
  CheckCircle,
  AlertCircle,
  Monitor,
  PanelLeft,
  Calendar,
  Activity
} from 'lucide-react';
import { logoutUser } from '../services/logoutService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import UpdateDoctorProfile from '../component/UpdateDoctorProfile';
import { getMe } from '../services/getMeServices';
import { getDoctorProfileApi, todaysOnlinePatientsApi } from '../services/doctorServices';
import { UpdatedDoctor } from '../component/UpdatedDoctor';
import { todaysPatientsApi } from '../services/doctorServices';
import DiagnosisForm from '../component/DiagnosisForm';
import { addMedicalRecordAPI } from '../services/medicalRecordServices';
import VideoCall from '../component/VideoCall';
import DoctorOnlinePatients from '../component/DoctorOnlinePatients';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [notifications, setNotifications] = useState(3);
  const [toggleSideBar, setToggleSideBar] = useState(false);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [doctorProfileDetail, setDoctorProfileDetail] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [todaysPatient, setTodaysPatient] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDiagnosisForm, setShowDiagnosisForm] = useState(false);
  const [onlineAppointments, setOnlineAppointments] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setToggleSideBar(false);
      } else {
        setToggleSideBar(true);
      }
    };

    // Call on mount
    handleResize();

    // Optional: respond to future resizes
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigate = useNavigate();

  const getMyDetails = async () => {
    const response = await getMe();
    if (response) {
      setDoctorDetails(response.user);
      console.log("My info fetched successfully !!", response.user);
    }
  }

  const getDoctorDetails = async () => {
    const response = await getDoctorProfileApi();
    if (response) {
      console.log(response.doctor)
      setDoctorProfileDetail(response.doctor)
      setToggle(true)
    }
  }

  const getTodaysPatient = async () => {
    const response = await todaysPatientsApi();
    if (response) {
      setTodaysPatient(response.appointments);
      setFilteredPatients(response.appointments);
      console.log("Today's patients fetched successfully !!", response.appointments);
    } else {
      console.log("Error fetching today's patients !!");
    }
  }

  // Filter patients based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredPatients(todaysPatient);
    } else {
      const filtered = todaysPatient.filter(patient =>
        patient?.bookedBy?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient?._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient?.contact?.includes(searchQuery) ||
        patient?.timeSlot?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [searchQuery, todaysPatient]);

  useEffect(() => {
    if (activeTab === 'profile') {
      getDoctorDetails();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'home') {
      getMyDetails();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'patients') {
      getTodaysPatient();
    }
  }, [activeTab]);



  const getOnlinePatientsAppointments = async () => {
    try {
      const response = await todaysOnlinePatientsApi();
      if (response) {
        setOnlineAppointments(response.appointments)
      }

    } catch (error) {
      console.log("Error in getting online appointments")

    }
  }

  useEffect(() => {
    if (activeTab === 'live') {
      getOnlinePatientsAppointments();
    }

  }, [activeTab])

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'patients', label: 'Today\'s Patients', icon: Users },
    { id: 'live', label: 'Live Chat', icon: Monitor },
  ];

  const handleDiagnose = (patient) => {
    setSelectedPatient(patient);
    setShowDiagnosisForm(true);
  };

  const handleCloseDiagnosisForm = () => {
    setShowDiagnosisForm(false);
    setSelectedPatient(null);
  };

  const handleSubmitDiagnosis = async (diagnosisData) => {
    try {
      // Here you would call your API to save the diagnosis
      const response = await addMedicalRecordAPI(diagnosisData);
      if (response) {
        console.log(response)
      }

      toast.success('Diagnosis saved successfully!');
      handleCloseDiagnosisForm();

    } catch (error) {
      console.error('Error saving diagnosis:', error);
      toast.error('Failed to save diagnosis. Please try again.');
    }
  };
  const handleLogout = async () => {
    const response = await logoutUser();
    if (response?.status === 200) {
      console.log("Logout successfully !!");
      toast.success("Logout successful!");
      navigate("/auth");
    } else {
      toast.error("Logout failed!");
    }


  };

  const doctorInfo = {
    name: doctorDetails?.name,
    specialty: doctorProfileDetail?.specialization,
    id: doctorProfileDetail?._id,
    phone: doctorDetails?.phone,
    email: doctorDetails?.email,
    address: doctorProfileDetail?.address,
    experience: doctorProfileDetail?.experience,
    education: doctorProfileDetail?.education,
    license: doctorProfileDetail?.licenseNumber,
    averageRating: doctorProfileDetail?.averageRating || 0,
    totalReviews: doctorProfileDetail?.totalReviews || 0,
    todaySchedule: '9:00 AM - 5:00 PM',
    nextAppointment: '2:30 PM - John Smith'
  };

  const todaysStats = [
    {
      icon: Users,
      label: 'Total Patients',
      value: todaysPatient.length.toString(),
      change: '+2 from yesterday',
      color: 'text-blue-400'
    },
    {
      icon: CheckCircle,
      label: 'Completed',
      value: todaysPatient.filter(p => p.status === 'Completed').length.toString(),
      change: `${Math.round((todaysPatient.filter(p => p.status === 'Completed').length / todaysPatient.length) * 100) || 0}% done`,
      color: 'text-green-400'
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 p-6 rounded-xl border border-green-500/30">
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome back, Dr. {doctorInfo.name}!
              </h2>
              <p className="text-gray-300">
                Medicine cures the body. Kindness cures the soul.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {todaysStats.map((stat, index) => (
                <div key={index} className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-gray-500 text-xs">{stat.change}</p>
                </div>
              ))}
            </div>

            {/* Today's Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                  Upcoming Appointments
                </h3>
                <div className="space-y-3">
                  {todaysPatient.filter(p => p.status === 'Waiting' || p.status === 'In Progress').slice(0, 3).map((patient, index) => (
                    <div key={index} className="bg-gray-700/30 p-3 rounded-lg border border-gray-600/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-white">{patient?.bookedBy?.name}</h4>
                          <p className="text-gray-400 text-sm">Age: {patient.age}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-blue-400 text-sm">{patient.timeSlot}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${patient.status === 'Emergency' ? 'bg-red-400/20 text-red-400' :
                            patient.status === 'In Progress' ? 'bg-yellow-400/20 text-yellow-400' :
                              'bg-blue-400/20 text-blue-400'
                            }`}>
                            {patient.status || 'Waiting'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {todaysPatient.filter(p => p.status === 'Waiting' || p.status === 'In Progress').length === 0 && (
                    <div className="text-gray-400 text-center py-4">
                      No upcoming appointments
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-400" />
                  Recent Activities
                </h3>
                <div className="space-y-3">
                  <div className="bg-green-500/20 p-3 rounded-lg border border-green-500/30">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 font-medium">Completed - Patient checkup</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">9:00 AM</p>
                  </div>
                  <div className="bg-yellow-500/20 p-3 rounded-lg border border-yellow-500/30">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-400 font-medium">In Progress - Patient consultation</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">2:00 PM</p>
                  </div>
                  <div className="bg-red-500/20 p-3 rounded-lg border border-red-500/30">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <span className="text-red-400 font-medium">Emergency - Urgent case handled</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">4:15 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          toggle ? <UpdatedDoctor doctorInfo={doctorInfo} /> : <UpdateDoctorProfile doctorDetails={doctorDetails} />
        );

      case 'patients':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Users className="w-6 h-6 mr-2 text-blue-400" />
                  Today's Patients
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search patients..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:border-blue-500 focus:outline-none w-64"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient, index) => (
                    <div key={index} className="bg-gray-700/30 p-4 rounded-lg border border-gray-600/30 hover:border-blue-500/50 transition-all duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{patient?.bookedBy?.name}</h4>
                          <p className="text-gray-400 text-sm">ID: {patient.bookedBy?._id}</p>
                          <p className="text-gray-400 text-sm">Age: {patient.age}</p>
                          <p className="text-gray-400 text-sm flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            Contact: {patient.contact}
                          </p>
                          <p className="text-blue-400 font-medium flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {patient.timeSlot}
                          </p>
                        </div>
                        <div className="text-right">
                          <button
                            onClick={() => handleDiagnose(patient)}
                            className="px-6 py-2 cursor-pointer bg-gradient-to-r from-green-600 to-teal-400 text-white font-semibold rounded-xl 
                                      hover:from-green-600 hover:to-teal-300 active:scale-95 transition-all duration-200 
                                      shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                          >
                            <Stethoscope className="w-4 h-4 inline mr-1" />
                            Diagnose
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    {searchQuery ? (
                      <div className="text-gray-400">
                        <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No patients found matching "{searchQuery}"</p>
                      </div>
                    ) : (
                      <div className="text-gray-400">
                        <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No patients scheduled for today</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );


      case "live":

        return (
          <div className="space-y-6">
            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">

              <DoctorOnlinePatients onlineAppointments={onlineAppointments} name={doctorInfo.name} />




            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex">
      {/* Sidebar */}
      <div
        className={`${toggleSideBar ? "w-64" : "w-20"} transition-all duration-300 ease-in-out bg-gray-900/50 border-r border-gray-700/50 flex flex-col backdrop-blur-sm overflow-hidden`}
      >
        <div className="p-4 border-b border-gray-700/50">
          <div className="flex mt-0.5 items-center justify-between">
            <div className="flex items-center space-x-3 group">
              {toggleSideBar && (
                <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-xl border border-emerald-500/30">
                  <Stethoscope className="text-emerald-400 w-7 h-7 group-hover:text-emerald-300" />
                </div>
              )}
              {!toggleSideBar && (
                <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-xl border border-emerald-500/30">
                  <Stethoscope className="text-emerald-400 w-7 h-7 group-hover:text-emerald-300" />
                </div>
              )}

              {toggleSideBar && (
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-emerald-100 to-emerald-200 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:to-blue-300 transition-all duration-300">
                  Triksha
                </h1>
              )}
            </div>
            <PanelLeft
              onClick={() => setToggleSideBar((prev) => !prev)}
              className={`${toggleSideBar ? "" : "mt-[10px] mb-[13px] mr-[10px]"
                } text-emerald-700 hover:text-emerald-500 cursor-pointer transition duration-300`}
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center ${toggleSideBar ? "space-x-3" : "justify-center"
                    } cursor-pointer p-3 rounded-lg relative ${activeTab === item.id
                      ? "bg-gradient-to-r from-green-500/20 to-blue-500/20 text-white border border-green-500/50"
                      : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                    }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {toggleSideBar && (
                    <span className="flex-1 text-left">{item.label}</span>
                  )}
                  {activeTab === item.id && (
                    <span
                      className={`w-1.5 h-1.5 bg-cyan-300 rounded-full ${toggleSideBar
                        ? "ml-auto"
                        : "absolute right-1.5 bottom-1.5"
                        }`}
                    ></span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700/50">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${toggleSideBar ? "space-x-3 justify-start" : "justify-center"
              } p-3 rounded-lg text-gray-300 hover:bg-red-600 cursor-pointer hover:text-white transition-all duration-300`}
          >
            <LogOut className="w-5 h-5" />
            {toggleSideBar && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        {activeTab === 'home' ? (<header className="bg-gray-900/30 border-b border-gray-700/50 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white capitalize">
                {activeTab === 'home' ? 'Dashboard' :
                  activeTab === 'profile' ? 'My Profile' :
                    'Today\'s Patients'}
              </h2>
              <p className="text-gray-400 text-sm">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-medium">Dr. {doctorInfo.name}</span>
              </div>
            </div>
          </div>
        </header>) : ""}

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* Diagnosis Form Modal */}
      {showDiagnosisForm && selectedPatient && (
        <DiagnosisForm
          patient={selectedPatient}
          doctorId={selectedPatient}
          hospitalId={selectedPatient} // You'll need to get this from your app state
          onClose={handleCloseDiagnosisForm}
          onSubmit={handleSubmitDiagnosis}
        />
      )}
    </div>
  )

};
export default DoctorDashboard;