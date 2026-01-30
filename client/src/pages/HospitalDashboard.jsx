import React, { useState, useEffect } from "react";
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
  PanelLeft,
  Phone,
  Mail,
  Scale,
  IdCard,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { logoutUser } from "../services/logoutService";
import { useNavigate } from "react-router-dom";
import { getHospital } from "../services/hospitalsServices";
import { getPatientsByHospital } from "../services/hospitalsServices";
import DrPatientsListByHospital from "../component/DrPatientsListByHospital";
import { getAllHospitalPatients } from "../services/hospitalsServices";
import { getAllAssistantsForHospital } from "../services/hospitalsServices";
import AllAssistants from "../component/AllAssistants";
import TodaysPatients from "../component/TodaysPatients";

const HospitalDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [notifications, setNotifications] = useState(5);
  const [toggleSideBar, setToggleSideBar] = useState(false);
  const [userData, setUserData] = useState(null);
  const [doctorsPatientsData, setDoctorsPatientsData] = useState([]);
  const [AllPatients, setAllPatients] = useState([]);
  const [allAssistants, setAllAssistants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [patientsLength, setPatientsLength] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setToggleSideBar(false);
      } else {
        setToggleSideBar(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigate = useNavigate();

  const getHospitalProfile = async () => {
    try {
      const response = await getHospital();
      if (response) {
        setUserData(response.hospital);
      }
    } catch (error) {
      console.log("Error in fetching profile", error);
      if (error.response?.status === 404) {
        navigate('/hospitalAdmin/profile');
      }
    }
  };

  useEffect(() => {
    getHospitalProfile();
  }, []);

  const fetchDRPatientsStats = async () => {
    try {
      const response = await getPatientsByHospital();
      if (response) {
        setDoctorsPatientsData(response.doctors);
      }
    } catch (error) {
      console.log("Error in fetching patient stats", error);
    }
  };

  useEffect(() => {
    if (activeTab === "doctors") {
      fetchDRPatientsStats();
    }
  }, [activeTab]);

  const fetchAllHospitalPatients = async () => {
    try {
      const response = await getAllHospitalPatients();
      if (response) {
        setAllPatients(response.appointments);
        setPatientsLength(response.totalAppointments);
      }
    } catch (error) {
      console.log("Error in fetching all hospital patients", error);
    }
  };

  useEffect(() => {
    fetchAllHospitalPatients();
  }, []);

  const fetchAllAssistants = async () => {
    try {
      const response = await getAllAssistantsForHospital();
      if (response) {
        setAllAssistants(response?.assistants);
      }
    } catch (error) {
      console.log("Error in fetching all assistants", error);
    }
  };

  useEffect(() => {
    if (activeTab === "assistants") {
      fetchAllAssistants();
    }
  }, [activeTab]);

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "profile", label: "My Profile", icon: User },
    { id: "patients", label: "Todays Patients", icon: Users },
    { id: "doctors", label: "Doctor Collection", icon: UserCheck },
    { id: "assistants", label: "Assistant Collection", icon: UserPlus },
  ];

  const hospitalStats = [
    {
      icon: Users,
      label: "Total Patients",
      value: patientsLength,
      change: "+12%",
      color: "text-blue-400",
    },
    {
      icon: UserCheck,
      label: "Doctors on Duty",
      value: "2",
      change: "+2",
      color: "text-purple-400",
    },
    {
      icon: Activity,
      label: "Emergency Cases",
      value: "0",
      change: "+3",
      color: "text-red-400",
    },
  ];

  const handleLogout = async () => {
    const response = await logoutUser();
    if (response?.status === 200) {
      toast.success("Logout successful!");
      navigate("/auth");
    } else {
      toast.error("Logout failed!");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="space-y-6">
            {/* Hospital Overview Card */}
            <div className="bg-linear-to-r from-emerald-500/20 to-blue-500/20 p-6 rounded-xl border border-blue-500/30">
              <h2 className="text-2xl font-bold text-white mb-2">
                Hospital Overview
              </h2>
              <p className="text-gray-300">
                Real-time hospital operations dashboard
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {hospitalStats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    <span className="text-xs text-green-400 bg-green-400/20 px-2 py-1 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {stat.value}
                  </h3>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent activity + alerts section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent admissions */}
              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Recent Admissions
                </h3>
                <div className="space-y-3">
                  {AllPatients.slice(0, 3).map((patient, index) => (
                    <div
                      key={index}
                      className="bg-gray-700/30 p-3 rounded-lg border border-gray-600/30"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-white">
                            {patient.name}
                          </h4>
                          <p className="text-gray-400 text-sm">
                            {patient.condition}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-blue-400 text-sm">
                            {patient.time}
                          </p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${patient.status === "Completed"
                              ? "bg-green-400/20 text-green-400"
                              : patient.status === "In Progress"
                                ? "bg-yellow-400/20 text-yellow-400"
                                : "bg-blue-400/20 text-blue-400"
                              }`}
                          >
                            {patient.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency alerts */}
              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Emergency Alerts
                </h3>
                <div className="space-y-3">
                  <div className="bg-red-500/20 p-3 rounded-lg border border-red-500/30">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <span className="text-red-400 font-medium">
                        Critical Patient - Room 205
                      </span>
                    </div>
                  </div>
                  <div className="bg-yellow-500/20 p-3 rounded-lg border border-yellow-500/30">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-400 font-medium">
                        Lab Results Pending - 3 Hours
                      </span>
                    </div>
                  </div>
                  <div className="bg-blue-500/20 p-3 rounded-lg border border-blue-500/30">
                    <div className="flex items-center space-x-2">
                      <Building className="w-5 h-5 text-blue-400" />
                      <span className="text-blue-400 font-medium">
                        Maintenance - OR 3 Tomorrow
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="flex items-center justify-center ">
            {/* Profile section */}
          </div>
        );

      case "patients":
        // Filter for today's appointments
        const todaysPatientsList = AllPatients.filter((patient) => {
          if (!patient.appointmentDate) return false;
          const today = new Date().toDateString();
          const appDate = new Date(patient.appointmentDate).toDateString();
          return today === appDate;
        });

        return (
          <div className="space-y-6">
            <TodaysPatients patients={todaysPatientsList} />
          </div>
        );

      case "doctors":
        return (
          <div className="space-y-6">
            {/* Doctor-patient list component */}
            <DrPatientsListByHospital
              data={doctorsPatientsData}
              onDoctorAdded={fetchDRPatientsStats}
            />
          </div>
        );

      case "assistants":
        return (
          <div className="space-y-6">
            {/* All assistants data */}
            <AllAssistants
              data={allAssistants}
              onAssistantAdded={fetchAllAssistants}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-800 flex">
      {/* Sidebar */}
      {toggleSideBar && (
        <div className="w-64 bg-gray-900/60 border-r border-gray-700/40 p-4 backdrop-blur-lg">
          <h2 className="text-white text-2xl font-bold mb-6">Dashboard</h2>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${activeTab === item.id
                  ? "bg-blue-500 text-white"
                  : "text-gray-300 hover:bg-gray-700"
                  }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-6 w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">{renderContent()}</div>
    </div>
  );
};

export default HospitalDashboard;
