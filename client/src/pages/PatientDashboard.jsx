import React, { useEffect, useState, useMemo, act } from "react";
import {
  getAllNearbyHospitals,
  getAllNearbyLabs,
  getMyAppointment,
  getMyLabAppointment,
  addReviewAPI,
} from "../services/patientServices";
import HospitalAppointmentBooking from "../component/HospitalAppointmentBooking";
import { LabAppointmentBooking } from "../component/LabsAppointmentBooking";
import { logoutUser } from "../services/logoutService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getMedicalRecordsAPI } from "../services/medicalRecordServices";
import LabReportComponent from "../component/LabReport";

import {
  Home,
  TestTube,
  MapPin,
  FlaskConical,
  FileText,
  BarChart3,
  Building2,
  LogOut,
  User,
  Bell,
  Activity,
  Heart,
  Thermometer,
  Weight,
  Clock,
  Plus,
  Search,
  Filter,
  Calendar,
  Stethoscope,
  PanelLeft,
  Monitor,
  BotMessageSquare,
  Globe,
  Globe2,
  Star,
  MessageSquare,
  Send,
  X
} from "lucide-react";

import { getMe } from "../services/getMeServices";
import UpdatePatientProfile from "../component/UpdateProfile";
import LoaderOnly from "../component/Loader";
import { AiIcon } from "../assets/robot";
import ChatBot from "../component/ChatBot";
import MedicalRecordPatient from "../component/MedicalRecordPatient";
import { getAllLabReport } from "../services/labServices";
import ThemeToggleSwitch from "../component/ThemeButton";
import VideoCall from "../component/VideoCall";
import { getOnlineApointments, cancelAppointmentAPI } from "../services/appointmentServices";
import LiveComponentPatient from "../component/LiveComponentPatient";

const PatientDashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("home");
  const [notifications, setNotifications] = useState(3);
  const [hospitals, setHospitals] = useState([]);
  const [labs, setLabs] = useState([]);
  const [userData, setUserData] = useState([]);
  const [appointment, setAppointment] = useState([]);
  const [labAppointments, setLabAppointment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggleSideBar, setToggleSideBar] = useState(false);
  const [vital, setVital] = useState(null);
  const [medicalRecord, setMedicalRecord] = useState([]);
  const [labReports, setLabReport] = useState([]);
  const [onlineAppointment, setOnlineAppointment] = useState([]);

  // Review System State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [currentReviewAppt, setCurrentReviewAppt] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Search state for records






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

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [userRes, appointmentRes, labAppointmentRes, vitalData] = await Promise.all([
          getMe(),
          getMyAppointment(),
          getMyLabAppointment(),
        ]);

        if (userRes) {
          setUserData(userRes);
          console.log(userRes);
        }
        if (appointmentRes) {
          setAppointment(appointmentRes?.appointments || []);
          console.log(appointmentRes)
        }
        if (labAppointmentRes) setLabAppointment(labAppointmentRes || []);
        if (vitalData) setVital(vitalData);
      } catch (error) {
        console.log("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "home") {
      fetchAllData();
    }
  }, [activeTab]);

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const response = await cancelAppointmentAPI(appointmentId);
      if (response?.status === 200) {
        toast.success("Appointment cancelled successfully");
        // Update the appointment list to reflect the change
        setAppointment((prevAppointments) =>
          prevAppointments.map((appt) =>
            appt._id === appointmentId ? { ...appt, status: "cancelled" } : appt
          )
        );
      }
    } catch (error) {
      toast.error("Failed to cancel appointment");
      console.error("Error cancelling appointment:", error);
    }
  };

  const handleRateAppointment = (appt) => {
    setCurrentReviewAppt(appt);
    setRating(0);
    setComment("");
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error("Please provide a rating");
      return;
    }

    setSubmittingReview(true);
    try {
      await addReviewAPI({
        appointmentId: currentReviewAppt._id,
        rating,
        comment
      });

      toast.success("Review submitted successfully");
      setReviewModalOpen(false);

      // Update appointment list to mark as reviewed
      setAppointment(prev => prev.map(a =>
        a._id === currentReviewAppt._id ? { ...a, isReviewed: true } : a
      ));

    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleLogout = async () => {
    const response = await logoutUser();
    if (response?.status === 200) {
      console.log("Logout successfully !!");
      toast.success("Logout successful!");
      navigate("/auth");
    }
  };

  const getHospital = async () => {


    if (!navigator.geolocation) {
      toast.error("Geolocation not supported.");
      setHospitalLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await getAllNearbyHospitals({ lat: latitude, lng: longitude });
          if (response) {
            setHospitals(response.hospitals || []);
          }
        } catch (error) {
          toast.error("Failed to fetch hospitals.");
        }
      },
      (err) => {
        console.error(err);
        toast.error("Please allow location access.");

      }
    );
  };



  useEffect(() => {
    if (activeTab === "appointment") {
      getHospital();
    }
  }, [activeTab]);

  const getMedicalRecords = async () => {
    const response = await getMedicalRecordsAPI();
    if (response) {
      // console.log(response);
      setMedicalRecord(response?.records || []);
    }
  };

  useEffect(() => {
    if (activeTab === "records") {
      getMedicalRecords();
    }
  }, [activeTab]);

  const getLabs = async () => {
    try {
      // Get user's current position
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;


          const response = await getAllNearbyLabs({ lat: latitude, lng: longitude });

          if (response) {
            console.log(response);
            setLabs(response?.labs || []);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Location permission is required to find nearby labs.");
        }
      );
    } catch (error) {
      console.error("Error in getLabs:", error);
    }
  };


  useEffect(() => {
    if (activeTab === "lab") {
      getLabs();
    }
  }, [activeTab]);


  const getLabReport = async () => {
    try {
      const response = await getAllLabReport();
      if (response) {
        setLabReport(response.reports)
        console.log(response);
      }

    } catch (error) {
      console.log("Error in fetching lab report", error)

    }
  }


  useEffect(() => {
    if (activeTab === 'reports') {
      getLabReport();
      console.log(labReports);

    }

  }, [activeTab])


  const onlineAppointmentPatients = async () => {
    try {
      const response = await getOnlineApointments();
      if (response) {
        setOnlineAppointment(response?.appointments)

      }

    } catch (error) {
      console.log("Error in fetching online appointments")

    }

  }

  useEffect(() => {
    if (activeTab === 'live') {
      onlineAppointmentPatients();
    }

  }, [activeTab])





  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "profile", label: "My Profile", icon: User },
    { id: "appointment", label: "Book Appointment", icon: Calendar },
    { id: "lab", label: "Book Lab", icon: FlaskConical },
    { id: "records", label: "Medical Record", icon: FileText },
    { id: "reports", label: "Lab Report", icon: BarChart3 },
    { id: "live", label: "Live Chat", icon: Monitor },
    { id: "ai", label: "AI Assistant", icon: BotMessageSquare },
  ];

  const vitalStats = [
    {
      icon: Heart,
      label: "Heart Rate",
      value: (userData?.user?.heartRate ? userData?.user?.heartRate + " bpm" : 72 + " bpm"),
      status: "normal",
      color: "text-rose-500",
    },
    {
      icon: Thermometer,
      label: "Temperature",
      value: (userData?.user?.temperature ? userData?.user?.temperature + " °F" : 98.6 + " °F"),
      status: "normal",
      color: "text-cyan-400",
    },
    {
      icon: Weight,
      label: "Blood Pressure",
      value: (userData?.user?.bloodPressure ? userData?.user?.bloodPressure + " mmHg" : "120/80 mmHg"),
      status: "normal",
      color: "text-purple-400",
    },
    {
      icon: Activity,
      label: "Oxygen Level",
      value: (userData?.user?.oxygenLevel ? userData?.user?.oxygenLevel + "%" : "98%"),
      status: "normal",
      color: "text-blue-400",
    },
  ];



  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="space-y-6 ">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 p-6 rounded-xl border border-green-500/30">
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome back, {userData?.user?.name}
              </h2>
              <p className="text-gray-300">
                Here's your health overview for today
              </p>
            </div>

            {/* Vital Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {vitalStats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 hover:border-green-500/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    <span className="text-xs text-green-400 bg-green-400/20 px-2 py-1 rounded-full">
                      {stat.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {stat.value}
                  </h3>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 p-6 rounded-xl border border-slate-700/40 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <h3 className="text-xl font-semibold text-slate-100">
                    Upcoming Appointments
                  </h3>
                </div>
                <button
                  className="text-blue-400 cursor-pointer hover:text-blue-300 transition-colors hover:scale-105 transform duration-200"
                  onClick={() => setActiveTab("appointment")}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                {appointment.map((appt, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-slate-800/40 to-slate-700/20 p-4 rounded-lg border border-slate-600/20 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-blue-400" />
                          <h4 className="font-medium text-slate-100">
                            {appt?.doctorId?.userId?.name || "Doctor Name"}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <Stethoscope className="w-4 h-4 text-pink-800" />
                          <p className="text-slate-300 text-sm">
                            {appt?.doctorId?.specialization || "Specialization"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-emerald-600" />
                          <p className="text-slate-400 text-xs">
                            {appt?.hospitalId?.name || "Hospital"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-2 mb-1">
                          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20">
                            <Globe className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm font-semibold text-emerald-300 capitalize">
                              {appt.mode}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 justify-end mb-1">
                          <Calendar className="w-4 h-4 text-blue-400" />
                          <p className="text-blue-400 font-medium">
                            {appt.date
                              ? new Date(appt.date).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                              : "Date"}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 justify-end">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <p className="text-slate-300 text-sm">
                            {appt.timeSlot || "Time"}
                          </p>
                        </div>

                      </div>
                      {appt.status !== "cancelled" && (
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => handleCancelAppointment(appt._id)}
                            className="px-3 py-1 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-full hover:bg-red-400/20 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                      {appt.status === "cancelled" && (
                        <div className="flex justify-end mt-2">
                          <span className="px-3 py-1 text-sm text-gray-400 bg-gray-400/10 border border-gray-400/20 rounded-full">
                            Cancelled
                          </span>
                        </div>
                      )}

                      {((appt.status === "completed") || (appt.status === "booked" && new Date(appt.date) < new Date())) && !appt.isReviewed && (
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => handleRateAppointment(appt)}
                            className="flex items-center gap-1 px-3 py-1 text-sm text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-full hover:bg-yellow-400/20 transition-colors"
                          >
                            <Star className="w-3 h-3" />
                            Rate
                          </button>
                        </div>
                      )}

                      {((appt.status === "completed") || (appt.status === "booked" && new Date(appt.date) < new Date())) && appt.isReviewed && (
                        <div className="flex justify-end mt-2">
                          <span className="flex items-center gap-1 px-3 py-1 text-sm text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full">
                            <Star className="w-3 h-3 fill-current" />
                            Reviewed
                          </span>
                        </div>
                      )}

                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 p-6 rounded-xl border border-slate-700/40 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TestTube className="w-5 h-5 text-blue-400" />
                  <h3 className="text-xl font-semibold text-slate-100">
                    Upcoming Lab Appointments
                  </h3>
                </div>
                <button
                  className="text-blue-400 cursor-pointer hover:text-blue-300 transition-colors hover:scale-105 transform duration-200"
                  onClick={() => setActiveTab("lab")}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                {labAppointments.map((appointment, index) => (
                  <div
                    key={appointment._id}
                    className="bg-gradient-to-r from-slate-800/40 to-slate-700/20 p-4 rounded-lg border border-slate-600/20 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <FlaskConical className="w-4 h-4 text-emerald-400" />
                          <h4 className="font-medium text-slate-100">
                            {appointment?.testDetails?.testName || "Test Name"}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <Activity className="w-4 h-4 text-purple-400" />
                          <p className="text-slate-300 text-sm">
                            {appointment?.testDetails?.testType || "Test Type"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <Building2 className="w-4 h-4 text-blue-400" />
                          <p className="text-slate-400 text-xs">
                            {appointment?.labId?.name || "Lab Name"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-orange-500" />
                          <p className="text-slate-400 text-xs">
                            {appointment?.labId?.address || "Lab Address"}
                          </p>
                        </div>
                        {appointment?.notes && (
                          <div className="flex items-center gap-2 mt-1">
                            <FileText className="w-4 h-4 text-yellow-400" />
                            <p className="text-slate-400 text-xs">
                              Note: {appointment.notes}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 justify-end mb-1">
                          <Calendar className="w-4 h-4 text-blue-400" />
                          <p className="text-blue-400 font-medium">
                            {appointment.scheduledDate
                              ? new Date(
                                appointment.scheduledDate
                              ).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })
                              : "Date"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 justify-end mb-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <p className="text-slate-300 text-sm">
                            {appointment.timeSlot || "Time"}
                          </p>
                        </div>
                        <div className="flex justify-end">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${appointment.status === "Completed"
                              ? "bg-green-400/20 text-green-400"
                              : appointment.status === "Pending"
                                ? "bg-yellow-400/20 text-yellow-400"
                                : appointment.status === "Cancelled"
                                  ? "bg-red-400/20 text-red-400"
                                  : "bg-blue-400/20 text-blue-400"
                              }`}
                          >
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div >
        );
      case "appointment":
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
              <HospitalAppointmentBooking hospitals={hospitals} />
            </div>
          </div>
        );
      case "lab":
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
              <LabAppointmentBooking labs={labs} />
            </div>
          </div>
        );
      case "profile":
        return (
          <div className="space-y-6">
            <div className="rounded-xl border ">
              <UpdatePatientProfile userData={userData} />
            </div>
          </div>
        );

      case "records":
        return (
          <div className="space-y-6 bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
            <MedicalRecordPatient medicalRecord={medicalRecord} />
          </div>
        );

      case "reports":
        return (
          <div className="space-y-6">
            <LabReportComponent labReports={labReports} />
          </div>
        );
      case "live":
        return (
          <div className="space-y-6">
            <LiveComponentPatient onlineAppointment={onlineAppointment} name={userData?.user?.name} />

          </div>
        );
      case "ai":
        return (
          <ChatBot userData={userData} />
        );
      default:
        return null;
    }
  };

  if (loading) return <LoaderOnly />;

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${toggleSideBar ? "w-64" : "w-20"
          } h-screen overflow-y-auto transition-all duration-300 ease-in-out bg-gray-900/50 border-r border-gray-700/50 flex flex-col backdrop-blur-sm`}
      >
        <div className="p-3 border-b border-gray-700/50">
          <div className="flex mt-0.5 items-center justify-between">
            <div className="flex items-center space-x-3 group">
              {toggleSideBar && (
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
              className={`${toggleSideBar ? "" : "mt-[10px] mb-[11px] mr-[10px]"
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
                  {item.id !== "ai" && (
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                  )}
                  {item.id === "ai" && (
                    <div>
                      <AiIcon className="w-4 h-4 flex-shrink-0" />
                    </div>
                  )}
                  {toggleSideBar && (
                    <span className="flex-1 text-left">{item.label}</span>
                  )}
                  {activeTab === item.id && item.id !== "ai" && (
                    <span
                      className={`w-1.5 h-1.5 bg-cyan-300 rounded-full ${toggleSideBar
                        ? "ml-auto"
                        : "absolute right-1.5 bottom-1.5"
                        }`}
                    ></span>
                  )}
                  {activeTab === item.id && item.id === "ai" && (
                    <span
                      className={`w-1.5 h-1.5 bg-emerald-500 rounded-full ${toggleSideBar
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        {activeTab === "home" && (
          <header className="sticky top-0 z-10 h-18 bg-gray-900/30 border-b border-gray-700/50 p-3 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white capitalize flex items-center">
                  {activeTab === "home"
                    ? "Dashboard"
                    : activeTab.replace(/([A-Z])/g, " $1").trim()}
                </h2>
                <p className="text-gray-400 text-sm">
                  {new Date().toLocaleDateString("en", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
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
                  <div className="w-8 h-8 bg-gradient-to-r from-green-700 to-blue-700 rounded-full flex items-center justify-center">
                    <button
                      className="cursor-pointer"
                      onClick={() => setActiveTab("profile")}
                    >
                      <User className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <span className="text-white font-medium">
                    {userData?.user?.name}
                  </span>
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Scrollable content */}
        <main
          className={`flex-1 overflow-y-auto p-6`}
        >
          {renderContent()}
        </main>

      </div>

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/50">
              <h3 className="text-lg font-semibold text-white">Rate Experience</h3>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-blue-400" />
                </div>
                <h4 className="text-white font-medium text-lg">
                  Dr. {currentReviewAppt?.doctorId?.userId?.name}
                </h4>
                <p className="text-gray-400 text-sm">{currentReviewAppt?.doctorId?.specialization}</p>
              </div>

              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                    />
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Share your feedback</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="How was your appointment?"
                  className="w-full h-24 bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                />
              </div>

              <button
                onClick={handleSubmitReview}
                disabled={submittingReview}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingReview ? (
                  <span className="animate-pulse">Submitting...</span>
                ) : (
                  <>
                    <span>Submit Review</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

};

export default PatientDashboard;
