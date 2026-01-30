import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Loader, FileText, User, Stethoscope, Calendar, Building2, ChevronDown, ChevronUp, Download, Eye, Clock, Pill, X, AlertCircle, BotMessageSquare, Sparkles, Activity } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getMedicalRecordSummaryAPI } from '../services/medicalRecordServices';

const MedicalRecordPatient = ({ medicalRecord = [] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRecordId, setExpandedRecordId] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [aiSummary, setAiSummary] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      if (medicalRecord.length > 0) {
        setLoadingSummary(true);
        try {
          const response = await getMedicalRecordSummaryAPI();
          if (response) {
            setAiSummary(response.summary);
            setGraphData(response.graphData || []);
          }
        } catch (error) {
          console.error("Failed to load AI summary:", error);
          setSummaryError(error.message || "Unknown Error");
        } finally {
          setLoadingSummary(false);
        }
      }
    };
    fetchSummary();
  }, [medicalRecord]);







  const filteredRecords = useMemo(() => {
    let records = [...medicalRecord];

    // Filter by type
    if (filterType !== "all") {
      records = records.filter(record => record.type === filterType);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase();
      records = records.filter((record) => (
        record?.type?.toLowerCase().includes(searchTerm) ||
        record?.doctorId?.userId?.name?.toLowerCase().includes(searchTerm) ||
        record?.medicine?.toLowerCase().includes(searchTerm) ||
        record?.description?.toLowerCase().includes(searchTerm) ||
        record?.doctorId?.hospitalId?.name?.toLowerCase().includes(searchTerm) ||
        record?.diagnosis?.toLowerCase().includes(searchTerm)
      ));
    }

    // Sort records
    records.sort((a, b) => {
      const dateA = new Date(a.prescribedAt || a.date);
      const dateB = new Date(b.prescribedAt || b.date);
      return sortBy === "date" ? dateB - dateA : dateA - dateB;
    });

    return records;
  }, [medicalRecord, searchQuery, filterType, sortBy]);

  // Predefined types for consistent filtering
  const RECORD_TYPES = ['Consultation', 'Prescription', 'Lab Report', 'Surgery', 'Vaccination', 'Emergency', 'Checkup', 'Follow-up'];

  const getRecordTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'consultation': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'emergency': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'surgery': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'follow-up': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'prescription': return 'text-teal-400 bg-teal-500/10 border-teal-500/30';
      case 'lab report': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'vaccination': return 'text-pink-400 bg-pink-500/10 border-pink-500/30';
      case 'checkup': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterType("all");
    setShowFilters(false);
  };






  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto ">
        {/* Header */}


        {/* Header with Search */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Medical Records
              </h1>
            </div>
            <p className="text-gray-400">View and manage your medical history</p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl pl-12 pr-10 py-3 text-white placeholder-gray-400 focus:border-emerald-500  focus:outline-none transition-all duration-300 w-80"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* AI Summary and Graph Section */}
        {medicalRecord.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* AI Summary */}
            <div className="lg:col-span-2 p-6 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-2xl border border-indigo-500/30 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <Sparkles className="w-24 h-24 text-purple-400" />
              </div>
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <BotMessageSquare className="w-6 h-6 text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold text-white">AI Health Assessment</h2>
              </div>

              {loadingSummary ? (
                <div className="flex items-center gap-3 text-gray-400 animate-pulse">
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Analyzing your medical history...</span>
                </div>
              ) : aiSummary ? (
                <div className="prose prose-invert max-w-none text-gray-300 text-sm leading-relaxed relative z-10">
                  <ReactMarkdown>{aiSummary}</ReactMarkdown>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="text-gray-400 text-sm">Unable to generate summary at this time.</p>
                  {summaryError && <p className="text-red-400 text-xs font-mono bg-red-900/20 p-2 rounded">{summaryError}</p>}
                </div>
              )}
            </div>

            {/* Visits Graph */}
            <div className="p-6 bg-gray-900/40 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Activity className="w-6 h-6 text-emerald-400" />
                </div>
                <h2 className="text-lg font-bold text-white">Visit Frequency</h2>
              </div>
              <div className="h-48 w-full">
                {graphData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={graphData}>
                      <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {graphData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#6366f1', '#ec4899', '#10b981', '#f59e0b'][index % 4]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                    No data available
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Filter Controls */}

        {/* Filter Controls */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">All Types</option>
              {RECORD_TYPES.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="date">Newest First</option>
              <option value="date-asc">Oldest First</option>
            </select>

            {(filterType !== "all" || searchQuery) && (
              <button
                onClick={clearFilters}
                className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>

          {/* Results Summary */}
          {searchQuery && (
            <div className="text-sm text-gray-400">
              {filteredRecords.length > 0
                ? `Found ${filteredRecords.length} record(s)`
                : `No records found`}
            </div>
          )}
        </div>

        {/* Records List */}
        <div className="space-y-4">
          {filteredRecords?.map((record, index) => (
            <div
              key={record._id || index}
              className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-emerald-500/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getRecordTypeColor(record.type)}`}>
                      {record.type?.charAt(0).toUpperCase() + record.type?.slice(1) || 'Consultation'}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {new Date(record?.prescribedAt || record?.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedRecordId(expandedRecordId === record._id ? null : record._id)}
                    className="flex items-center cursor-pointer gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <span className="text-sm">
                      {expandedRecordId === record._id ? 'Hide Details' : 'View Details'}
                    </span>
                    {expandedRecordId === record._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-3">
                    {record?.doctorId?.userId?.name && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <User className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{record.doctorId.userId.name}</p>
                          <p className="text-gray-400 text-sm">{record.doctorId.specialization}</p>
                        </div>
                      </div>
                    )}

                    {(record?.medicine || record?.diagnosis) && (
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <Stethoscope className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs uppercase tracking-wide">Diagnosis</p>
                          <p className="text-white font-medium">{record.medicine || record.diagnosis}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-3">
                    {record?.doctorId?.hospitalId?.name && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-500/20 rounded-lg">
                          <Building2 className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs uppercase tracking-wide">Hospital</p>
                          <p className="text-white font-medium">{record.doctorId.hospitalId.name}</p>
                        </div>
                      </div>
                    )}

                    {record?.description && (
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                          <FileText className="w-4 h-4 text-yellow-400" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs uppercase tracking-wide">Description</p>
                          <p className="text-gray-300 text-sm">{record.description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedRecordId === record._id && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Prescribed Medicines */}
                      {record?.medicines?.length > 0 && (
                        <div className="bg-white/5 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Pill className="w-5 h-5 text-green-400" />
                            <h4 className="text-white font-semibold">Prescribed Medicines</h4>
                          </div>
                          <div className="space-y-3">
                            {record.medicines.map((med, idx) => (
                              <div key={idx} className="bg-white/5 rounded-lg p-3">
                                <p className="text-green-400 font-medium">{med.name}</p>
                                <div className="text-sm text-gray-300 mt-1 space-y-1">
                                  <p><span className="text-gray-400">Dosage:</span> {med.dosage}</p>
                                  <p><span className="text-gray-400">Frequency:</span> {med.frequency}</p>
                                  <p><span className="text-gray-400">Duration:</span> {med.duration}</p>
                                  {med.notes && <p><span className="text-gray-400">Notes:</span> {med.notes}</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Doctor's Notes */}
                      {record?.notes && record.notes.trim() !== "" && (
                        <div className="bg-white/5 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="w-5 h-5 text-blue-400" />
                            <h4 className="text-white font-semibold">Doctor's Notes</h4>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed">{record.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Empty States */}
          {filteredRecords.length === 0 && !searchQuery && medicalRecord.length === 0 && (
            <div className="text-center py-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
              <div className="max-w-md mx-auto">
                <div className="p-4 bg-gray-500/20 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Medical Records</h3>
                <p className="text-gray-400">Your medical records will appear here once you have consultations with healthcare providers.</p>
              </div>
            </div>
          )}

          {filteredRecords.length === 0 && (searchQuery || filterType !== "all") && medicalRecord.length > 0 && (
            <div className="text-center py-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
              <div className="max-w-md mx-auto">
                <div className="p-4 bg-gray-500/20 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Records Found</h3>
                <p className="text-gray-400 mb-4">
                  No records match your current search criteria. Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordPatient;