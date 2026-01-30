import React, { useState, useEffect } from "react";
import {
  Home,
  Users,
  MapPin,
  LogOut,
  User,
  Bell,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Stethoscope,
  Activity,
  Send,
  PanelLeft,
} from "lucide-react";
import { logoutUser } from "../services/logoutService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import AssistantForm from "../component/UpdatedAssistantProfile";
import { getMe } from "../services/getMeServices";
import { getAssistantProfile } from "../services/assistantServices";
import AssistantData from "../component/AssistantData";
import { getAllApointments } from "../services/appointmentServices";
import { notifyViaFCM } from "../services/firebaseServices";
import LoaderOnly from "../component/Loader";
import { VitalSignsForm } from "../component/VitalStats";


const AssistantDashboard = () => {
  const [toggleSideBar, setToggleSideBar] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const [draggedPatient, setDraggedPatient] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [userData, setUserData] = useState([]);
  const [assistantData, setAssistantData] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [appointments, setAllAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVitalForm, setShowVitalForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [queueData, setQueueData] = useState({
    upcoming: [],
    inProgress: [],
    completed: [],
    cancelled: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [userResponse, appointmentsResponse, profileResponse] =
          await Promise.all([
            getMe(),
            getAllApointments(),
            getAssistantProfile(),

          ]);

        if (userResponse) {
          setUserData(userResponse);
        }

        if (appointmentsResponse) {
          setAllAppointments(appointmentsResponse?.appointments || []);
        }

        if (profileResponse?.success) {
          setAssistantData(profileResponse);
          setToggle(true);
        }
      } catch (error) {
        console.error("Error during initial data fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "profile", label: "My Profile", icon: User },
    { id: "patients", label: "Todays Patients", icon: Users },
    { id: "queue", label: "Queue Map", icon: MapPin },
  ];

  // Convert appointments to queue format
  useEffect(() => {
    if (appointments.length > 0) {
      const categorizedAppointments = {
        upcoming: [],
        inProgress: [],
        completed: [],
        cancelled: [],
      };

      appointments.forEach((appointment) => {
        const queueItem = {
          patientId: appointment.bookedBy._id,
          id: appointment._id,
          name: appointment?.bookedBy?.name || "Unknown Patient",
          age: appointment.age || "N/A",
          condition: appointment.reason || "General Consultation",
          doctor: appointment?.doctorId?.userId?.name || "N/A",
          time: appointment.timeSlot || "N/A",
          status: appointment.status,
          appointmentData: appointment, // Store full appointment data
        };

        const status = appointment.status?.toLowerCase();
        switch (status) {
          case "confirmed":
          case "scheduled":
            categorizedAppointments.upcoming.push(queueItem);
            break;
          case "in-progress":
          case "ongoing":
            categorizedAppointments.inProgress.push(queueItem);
            break;
          case "completed":
            categorizedAppointments.completed.push(queueItem);
            break;
          case "cancelled":
            categorizedAppointments.cancelled.push(queueItem);
            break;
          default:
            categorizedAppointments.upcoming.push(queueItem);
        }
      });

      setQueueData(categorizedAppointments);
    }
  }, [appointments]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  console.log(appointments);



  const handleLogout = async () => {
    const response = await logoutUser();
    if (response?.status === 200) {
      console.log("Logout successfully !!");
      toast.success("Logout successful!");
      navigate("/auth");
    }
  };


  const handleDragStart = (e, patient) => {
    setDraggedPatient(patient);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", patient.id);

    // Add visual feedback
    e.currentTarget.style.opacity = "1";
    e.currentTarget.style.transform = "scale(0.95)";
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = "1";
    e.currentTarget.style.transform = "scale(1)";
    setDraggedPatient(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e, columnKey) => {
    e.preventDefault();
    setDragOverColumn(columnKey);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    // Only clear if we're leaving the column entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e, targetColumn) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedPatient) return;

    const sourceColumn = Object.keys(queueData).find((key) =>
      queueData[key].some((patient) => patient.id === draggedPatient.id)
    );

    if (sourceColumn === targetColumn) {
      setDraggedPatient(null);
      return;
    }

    // Update queue data
    setQueueData((prev) => {
      const newData = { ...prev };
      newData[sourceColumn] = newData[sourceColumn].filter(
        (p) => p.id !== draggedPatient.id
      );

      // Update status based on target column
      const updatedPatient = { ...draggedPatient };
      switch (targetColumn) {
        case "upcoming":
          updatedPatient.status = "confirmed";
          break;
        case "inProgress":
          updatedPatient.status = "in-progress";
          break;
        case "completed":
          updatedPatient.status = "completed";
          break;
        case "cancelled":
          updatedPatient.status = "cancelled";
          break;
      }

      newData[targetColumn] = [...newData[targetColumn], updatedPatient];
      return newData;
    });

    // Send notification when patient is moved to "In Progress"
    if (targetColumn === "inProgress") {
      sendNotification(draggedPatient);
    } else {
      toast.success(
        `Patient moved to ${targetColumn
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()}`
      );
    }
    setDraggedPatient(null);
  };

  const sendNotification = async (patient) => {
    const userId = patient.patientId;

    try {
      const response = await notifyViaFCM(userId);
      if (response.success) {
        toast.info(`Notification sent to ${patient.name}`);
        console.log("Notification sent successfully");
      }
    } catch (error) {
      console.log("Error in sending notification in Assistant dashboard");
    }
  };

  const PatientCard = ({ patient, columnType }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, patient)}
      onDragEnd={handleDragEnd}
      className="p-4 rounded-xl border border-b-amber-300 bg-green-900/80 shadow-sm hover:shadow-lg hover:shadow-amber-500/30 cursor-grab active:cursor-grabbing transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-white font-semibold truncate">{patient.name}</h4>
        <span className="text-sm text-gray-300">Age: {patient.age}</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-300 mt-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{patient.time}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-gray-400">{patient.id.slice(-6)}</span>
          {columnType !== "upcoming" && (
            <button
              onClick={() => sendNotification(patient, columnType)}
              className="text-cyan-400 hover:text-cyan-300 transition-transform transform hover:scale-110"
              title="Send Notification"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const KanbanColumn = ({ title, patients, columnKey, icon: Icon, color }) => (
    <div
      className={`bg-gray-800/30 p-4 rounded-xl border transition-all duration-300 min-h-[600px] ${dragOverColumn === columnKey
          ? "border-blue-500/70 bg-blue-500/10 shadow-lg shadow-blue-500/20"
          : "border-gray-700/50"
        }`}
      onDragOver={handleDragOver}
      onDragEnter={(e) => handleDragEnter(e, columnKey)}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, columnKey)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon className={`w-5 h-5 ${color}`} />
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <span className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full text-xs">
            {patients.length}
          </span>
        </div>
      </div>
      <div className="space-y-3">
        {patients.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-700/30 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Icon className={`w-6 h-6 ${color} opacity-50`} />
            </div>
            <p className="text-gray-500 text-sm">
              No patients in {title.toLowerCase()}
            </p>
          </div>
        ) : (
          patients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              columnType={columnKey}
            />
          ))
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 p-6 rounded-xl border border-green-500/30">
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome Back ,{userData?.user?.name}
              </h2>
              <p className="text-gray-300">
                Manage patient queues and send notifications
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-8 h-8 text-yellow-400" />
                  <span className="text-xs text-yellow-400 bg-yellow-400/20 px-2 py-1 rounded-full">
                    {appointments.length}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Total Appointments
                </h3>
                <p className="text-gray-400 text-sm">All appointments</p>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-8 h-8 text-blue-400" />
                  <span className="text-xs text-blue-400 bg-blue-400/20 px-2 py-1 rounded-full">
                    {queueData.inProgress.length}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white">
                  In Progress
                </h3>
                <p className="text-gray-400 text-sm">Currently being treated</p>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                  <span className="text-xs text-green-400 bg-green-400/20 px-2 py-1 rounded-full">
                    {queueData.completed.length}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white">Completed</h3>
                <p className="text-gray-400 text-sm">Finished appointments</p>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <XCircle className="w-8 h-8 text-red-400" />
                  <span className="text-xs text-red-400 bg-red-400/20 px-2 py-1 rounded-full">
                    {queueData.cancelled.length}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white">Cancelled</h3>
                <p className="text-gray-400 text-sm">Cancelled appointments</p>
              </div>
            </div>
          </div>
        );

      case "patients":
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">All Patients</h2>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 font-medium">
                    {appointments.length} Total Appointments
                  </span>
                </div>
              </div>

              {showVitalForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-gray-900 p-6 rounded-xl w-[90%] md:w-[60%] lg:w-[40%] max-h-[90vh] overflow-auto">
                    <VitalSignsForm
                      appointment={selectedAppointment}
                      onClose={() => setShowVitalForm(false)}
                    />
                  </div>
                </div>
              )}

              {appointments.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">
                    No Appointments Found
                  </h3>
                  <p className="text-gray-500">
                    There are no appointments scheduled at this time.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border border-gray-700/50 bg-gray-800/20 hover:bg-gray-800/40 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium text-white text-lg">
                              {appointment?.bookedBy?._id ?? "N/A"}
                            </h4>
                            <span
                              className={`text-xs px-2 py-1 rounded-full bg-green-800`}
                            >
                              {appointment.status || "Pending"}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                            <div className="space-y-1">
                              <p className="text-gray-400">
                                <span className="font-medium">Patient ID:</span>{" "}
                                {appointment.bookedBy._id || "N/A"}
                              </p>
                              <p className="text-gray-400">
                                <span className="font-medium">Age:</span>{" "}
                                {appointment.age || "N/A"}
                              </p>
                              <p className="text-gray-400">
                                <span className="font-medium">Gender:</span>{" "}
                                {appointment.gender || "N/A"}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <p className="text-gray-300">
                                <span className="font-medium">Doctor:</span>{" "}
                                {appointment?.doctorId?.userId?.name || "N/A"}
                              </p>
                              <p className="text-gray-300">
                                <span className="font-medium">
                                  Specialization:
                                </span>{" "}
                                {appointment?.doctorId?.specialization || "N/A"}
                              </p>
                              <p className="text-gray-300">
                                <span className="font-medium">Reason:</span>{" "}
                                {appointment.reason || "General Consultation"}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-blue-400" />
                                <span className="text-blue-400 font-medium">
                                  {formatDate(appointment.date)}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-blue-400" />
                                <span className="text-blue-400 font-medium">
                                  {appointment.timeSlot}
                                </span>
                              </div>
                              <p className="text-gray-400">
                                <span className="font-medium">Contact:</span>{" "}
                                {appointment.contact || "N/A"}
                              </p>
                            </div>
                          </div>

                          {appointment.notes && (
                            <div className="mt-3 p-3 bg-gray-700/30 rounded-md">
                              <p className="text-gray-300 text-sm">
                                <span className="font-medium">Notes:</span>{" "}
                                {appointment.notes}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-end space-y-2 ml-4">
                          {appointment.urgent && (
                            <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full">
                              Urgent
                            </span>
                          )}
                          {
                            appointment?.bookedBy?.vitalUpdated === true ? (
                              <span className="bg-green-500/20 text-green-400  px-3 py-1 rounded-md text-sm transition-colors">
                                Already Updated
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  setShowVitalForm(true);
                                  setSelectedAppointment(appointment);
                                }}
                                className="bg-blue-500/20 cursor-pointer hover:bg-blue-500/30 text-blue-400 px-3 py-1 rounded-md text-sm transition-colors"
                              >
                                Update Vital Stats
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6">
            {toggle ? (
              <AssistantData
                assistantData={assistantData}
                userData={userData}
              />
            ) : (
              <AssistantForm />
            )}
          </div>
        );

      case "queue":
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Patient Queue Management
                </h2>
                <div className="text-sm text-gray-400">
                  Drag and drop patients between columns to update their status
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KanbanColumn
                  title="Upcoming"
                  patients={queueData.upcoming}
                  columnKey="upcoming"
                  icon={Clock}
                  color="text-yellow-400"
                />
                <KanbanColumn
                  title="In Progress"
                  patients={queueData.inProgress}
                  columnKey="inProgress"
                  icon={Activity}
                  color="text-blue-400"
                />
                <KanbanColumn
                  title="Completed"
                  patients={queueData.completed}
                  columnKey="completed"
                  icon={CheckCircle}
                  color="text-green-400"
                />
                <KanbanColumn
                  title="Cancelled"
                  patients={queueData.cancelled}
                  columnKey="cancelled"
                  icon={XCircle}
                  color="text-red-400"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };
  if (loading) return <LoaderOnly />;

  {
    showVitalForm && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-gray-900 p-6 rounded-xl w-[90%] md:w-[60%] lg:w-[40%] max-h-[90vh] overflow-auto">
          <VitalSignsForm
            appointment={selectedAppointment}
            onClose={() => setShowVitalForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex">
      {/* Sidebar */}
      <div
        className={`${toggleSideBar ? "w-64" : "w-20"
          } transition-all duration-300 ease-in-out bg-gray-900/50 border-r border-gray-700/50 flex flex-col backdrop-blur-sm overflow-hidden`}
      >
        <div className=" p-3 border-b border-gray-700/50">
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
              className={`${toggleSideBar ? "" : "mt-[10px] mb-[10px] mr-[10px]"
                } text-emerald-700 hover:text-emerald-500 cursor-pointer   transition duration-300`}
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

        {activeTab === "home" && (
          <header className="bg-gray-900/30 border-b border-gray-700/50 p-[11px] backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white capitalize">
                  {activeTab === "home"
                    ? "Assistant Dashboard"
                    : activeTab === "queue"
                      ? "Queue Management"
                      : activeTab.replace(/([A-Z])/g, " $1").trim()}
                </h2>
                <p className="text-gray-400 text-sm">
                  {new Date().toLocaleDateString("en-US", {
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
                  {/* {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {notifications}
                    </span>
                  )} */}
                </button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-700 to-blue-700 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-medium">
                    {userData?.user?.name}
                  </span>
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AssistantDashboard;
