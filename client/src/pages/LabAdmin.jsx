import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecentAdmissions from '../component/RecentAdmissions';
import { getLabProfile } from '../services/labServices';
import { logoutUser } from "../services/logoutService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import {
  Home,
  Users,
  FlaskConical,
  UserCheck,
  UserPlus,
  LogOut,
  User,
  Bell,
  Activity,
  Bed,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Plus,
  Heart,
  Stethoscope,
  Building,
  Settings,
  FlaskConicalIcon,
  Loader2
} from 'lucide-react';
import UpdateLabProfile from '../component/UpdateLabProfile';
import LabRegistration from '../component/LabRegistration';
import LabProfileView from '../component/LabProfile';
import { getAllLabAppointmentbyLab } from '../services/labServices';
import UploadReportForm from '../component/UploadReportForm';

// Loading Spinner Component
const LoadingSpinner = ({ size = "w-6 h-6", className = "" }) => (
  <Loader2 className={`animate-spin ${size} ${className}`} />
);

// Skeleton Loading Component
const SkeletonCard = () => (
  <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 animate-pulse">
    <div className="flex items-center justify-between mb-2">
      <div className="w-8 h-8 bg-gray-700 rounded"></div>
      <div className="w-12 h-4 bg-gray-700 rounded"></div>
    </div>
    <div className="w-16 h-6 bg-gray-700 rounded mb-1"></div>
    <div className="w-24 h-4 bg-gray-700 rounded"></div>
  </div>
);

const PatientSkeleton = () => (
  <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600/30 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="w-48 h-5 bg-gray-600 rounded mb-2"></div>
        <div className="w-64 h-4 bg-gray-600 rounded mb-1"></div>
        <div className="w-32 h-4 bg-gray-600 rounded"></div>
      </div>
      <div className="text-right flex flex-col items-end gap-2">
        <div className="w-16 h-5 bg-gray-600 rounded"></div>
        <div className="w-20 h-6 bg-gray-600 rounded"></div>
      </div>
    </div>
  </div>
);

const LabDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [notifications, setNotifications] = useState(5);
  const [labLoading, setLabLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [totalPatientsToday, setTotalPatientsToday] = useState(0);
  const [labId, setLabId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [labData, setLabData] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [totalAppointments, setTotalAppointments] = useState([]);
  const navigate = useNavigate();

  const loadLabProfile = async () => {
    setLabLoading(true);
    try {
      const data = await getLabProfile();
      if (data) {
        setToggle(true);
        setLabData(data.lab);
        setLabId(data.lab?._id);
      }
    } catch (error) {
      console.error("Error loading lab profile:", error);
      setLabData(null);
    } finally {
      setLabLoading(false);
    }
  };

  useEffect(() => {
    loadLabProfile();
  }, []);

  const getAllLabAppointment = async () => {
    setAppointmentsLoading(true);
    try {
      const response = await getAllLabAppointmentbyLab(labData?._id);
      if (response) {
        setTotalAppointments(response.appointments);
      }
    } catch (error) {
      console.error("Error fetching lab appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setAppointmentsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "patients" && labData?._id) {
      getAllLabAppointment();
    }
  }, [activeTab, labData]);

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      if (response?.status === 200) {
        toast.success("Logout successful!");
        navigate("/auth");
      }
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    async function fetchCount() {
      setStatsLoading(true);
      try {
        const response = await axios.get("/api/lab-appointments/today/count");
        setTotalPatientsToday(response.data.count);
      } catch (error) {
        console.error("Error fetching today's count:", error);
        setTotalPatientsToday(0);
      } finally {
        setStatsLoading(false);
      }
    }
    fetchCount();
  }, []);

  useEffect(() => {
    if (!labId) return;
    async function fetchData() {
      try {
        const res = await axios.get(`/api/lab/labs/${labId}/today-appointments`);
        setAppointments(res.data || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppointments([]);
      }
    }
    fetchData();
  }, [labId]);

  const filtered = !search.trim()
    ? totalAppointments
    : totalAppointments.filter(appt =>
      (appt.bookedBy?.name || "")
        .toLowerCase()
        .includes(search.toLowerCase().trim())
    );

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: "profile", label: "My Profile", icon: User },
    { id: 'patients', label: 'Todays Patients', icon: Users },
    { id: 'Send Reports', label: 'Send Reports', icon: FlaskConical },
    { id: 'Update Profile', label: 'Update Profile', icon: Settings }
  ];

  const labStats = [
    {
      icon: Users,
      label: 'Total Patients',
      value: totalPatientsToday,
      change: '+0%',
      color: 'text-blue-400',
      loading: statsLoading
    },
    {
      icon: FlaskConicalIcon,
      label: 'Total Collections',
      value: '0',
      change: '0%',
      color: 'text-green-400',
      loading: false // Set to true if you have API for this
    },
    {
      icon: UserCheck,
      label: 'Assistant on Duty',
      value: '0',
      change: '+0',
      color: 'text-purple-400',
      loading: false // Set to true if you have API for this
    },
    {
      icon: Activity,
      label: 'Report Submitted',
      value: '0',
      change: '+0',
      color: 'text-red-400',
      loading: false // Set to true if you have API for this
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 p-6 rounded-xl border border-purple-500/30">
              <h2 className="text-2xl font-bold text-white mb-2">Lab Overview</h2>
              <p className="text-gray-300">Real-time Lab operations dashboard</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {labStats.map((stat, index) => (
                <div key={index} className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 hover:border-pink-500/50 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    <span className="text-xs text-green-400 bg-green-400/20 px-2 py-1 rounded-full">
                      {stat.loading ? <LoadingSpinner size="w-3 h-3" /> : stat.change}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    {stat.loading ? <LoadingSpinner size="w-4 h-4" /> : stat.value}
                  </h3>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentAdmissions totalAppointments={totalAppointments} />

              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
                <h3 className="text-xl font-semibold text-white mb-4">Emergency Alerts</h3>
                <div className="space-y-3">
                  <div className="bg-red-500/20 p-3 rounded-lg border border-red-500/30">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <span className="text-red-400 font-medium">No critical alerts</span>
                    </div>
                  </div>
                  <div className="bg-yellow-500/20 p-3 rounded-lg border border-yellow-500/30">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-400 font-medium">All reports up to date</span>
                    </div>
                  </div>
                  <div className="bg-blue-500/20 p-3 rounded-lg border border-blue-500/30">
                    <div className="flex items-center space-x-2">
                      <Building className="w-5 h-5 text-blue-400" />
                      <span className="text-blue-400 font-medium">System operating normally</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'patients':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  Today's Patients
                  {appointmentsLoading && <LoadingSpinner className="text-blue-400" />}
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search patients..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                      disabled={appointmentsLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {appointmentsLoading ? (
                  // Loading skeletons
                  Array.from({ length: 3 }).map((_, index) => (
                    <PatientSkeleton key={index} />
                  ))
                ) : filtered.length === 0 ? (
                  <div className="text-gray-400 text-center py-8">
                    {search.trim() ? "No patients found matching your search." : "No patients found for today."}
                  </div>
                ) : (
                  filtered.map(appt => (
                    <div
                      key={appt._id}
                      className="bg-gray-700/30 p-4 rounded-lg border border-gray-600/30 hover:border-blue-500/50 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-white">
                            {appt.bookedBy?.name || "Unknown"} ({appt.bookedBy?._id || "ID"})
                          </h4>
                          <p className="text-gray-400 text-sm">
                            Test: {appt.testDetails?.testName || "N/A"} | Type: {appt.testDetails?.testType || "N/A"}
                          </p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                          <p className="text-blue-400 font-medium">
                            {new Date(appt.scheduledDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                          {appt.status === "Pending" ? (
                            <button
                              className="text-blue-600 bg-blue-400/20 px-3 py-1 rounded-full font-semibold hover:bg-blue-400/40 transition"
                              onClick={() => {
                                setSelectedAppointment(appt);
                                setActiveTab('Send Reports');
                              }}
                            >
                              Review
                            </button>
                          ) : (
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${appt.status === "Completed"
                                  ? "bg-green-400/20 text-green-400"
                                  : appt.status === "In Progress"
                                    ? "bg-yellow-400/20 text-yellow-400"
                                    : "bg-blue-400/20 text-blue-400"
                                }`}
                            >
                              {appt.status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      case 'profile': {
        if (labLoading) {
          return (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <LoadingSpinner size="w-8 h-8" className="text-blue-400 mx-auto mb-4" />
                <p className="text-gray-400">Loading profile...</p>
              </div>
            </div>
          );
        }

        return (
          toggle
            ? <LabProfileView labData={labData} />
            : <LabRegistration onRegistered={async () => {
              setLabLoading(true);
              try {
                const data = await getLabProfile();
                setLabId(data._id);
                setLabData(data);
                setToggle(true);
              } catch (error) {
                console.error("Error after registration:", error);
              } finally {
                setLabLoading(false);
              }
            }} />
        );
      }

      case 'Send Reports':
        return (
          <div className="p-6 space-y-4">
            <h2 className="text-2xl font-bold text-white mb-2"> Report</h2>

            {!selectedAppointment ? (
              <div className="bg-gray-800/30 p-8 rounded-xl border border-gray-700/50 text-center">
                <FlaskConical className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Please select a patient from the Today's Patients list first.</p>
                <button
                  onClick={() => setActiveTab('patients')}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Go to Patients
                </button>
              </div>
            ) : (
              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Selected Patient</h3>
                  <p className="text-gray-300">
                    {selectedAppointment.bookedBy?.name || "Unknown"} - {selectedAppointment.testDetails?.testName || "N/A"}
                  </p>
                </div>
                {/* Add your UploadReportForm component here */}
                <UploadReportForm appointment={selectedAppointment} />
              </div>
            )}
          </div>
        );

      case 'Update Profile':
        if (labLoading) {
          return (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <LoadingSpinner size="w-8 h-8" className="text-blue-400 mx-auto mb-4" />
                <p className="text-gray-400">Loading profile...</p>
              </div>
            </div>
          );
        }

        return (
          <>
            {labData ? (
              <UpdateLabProfile labData={labData} />
            ) : (
              <div className="text-white text-center">No profile data available</div>
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900/50 border-r border-gray-700/50 flex flex-col backdrop-blur-sm">
        {/* Logo */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center gap-x-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-xl border border-emerald-500/30">
              <Stethoscope className="text-emerald-400 w-7 h-7 group-hover:text-emerald-300" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-emerald-100 to-emerald-200 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:to-blue-300 transition-all duration-300">
              Triksha
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  disabled={labLoading && (item.id === 'profile' || item.id === 'Update Profile')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${activeTab === item.id
                      ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-white border border-blue-500/50'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                    } ${(labLoading && (item.id === 'profile' || item.id === 'Update Profile')) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {appointmentsLoading && item.id === 'patients' && (
                    <LoadingSpinner size="w-4 h-4" />
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
            className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-900/30 border-b border-gray-700/50 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white capitalize">
                {activeTab === 'home' ? 'Lab Dashboard' : activeTab.replace(/([A-Z])/g, ' $1').trim()}
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
                <span className="text-white font-medium">
                  {labLoading ? <LoadingSpinner size="w-4 h-4" /> : (labData?.name || "Admin")}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default LabDashboard;