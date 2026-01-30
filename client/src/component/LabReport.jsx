import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, FileText, Loader, User, Download, Calendar, Building2, ChevronDown, ChevronUp, Eye, Clock, TestTube, X, AlertCircle, MapPin, BotMessageSquare, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getLabReportSummaryAPI } from '../services/labServices';

const LabReportComponent = ({ labReports = [] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedReportId, setExpandedReportId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTestType, setFilterTestType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [selectedReport, setSelectedReport] = useState(null);
  const [aiSummary, setAiSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  

  useEffect(() => {
    const fetchSummary = async () => {
      if (labReports.length > 0) {
        setLoadingSummary(true);
        try {
          const response = await getLabReportSummaryAPI();
          if (response?.summary) {
            setAiSummary(response.summary);
          }
        } catch (error) {
          console.error("Failed to load AI summary:", error);
        } finally {
          setLoadingSummary(false);
        }
      }
    };
    fetchSummary();
  }, [labReports]);
  const handleDownload = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const blobURL = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobURL;
      link.download = 'report.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobURL);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };


  const filteredReports = useMemo(() => {
    let reports = [...labReports];

    // Filter by status
    if (filterStatus !== "all") {
      reports = reports.filter(report => report.status?.toLowerCase() === filterStatus.toLowerCase());
    }

    // Filter by test type
    if (filterTestType !== "all") {
      reports = reports.filter(report => report.testDetails?.testType?.toLowerCase() === filterTestType.toLowerCase());
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase();
      reports = reports.filter((report) => (
        report?.testDetails?.testName?.toLowerCase().includes(searchTerm) ||
        report?.testDetails?.testType?.toLowerCase().includes(searchTerm) ||
        report?.labId?.name?.toLowerCase().includes(searchTerm) ||
        report?.labId?.address?.toLowerCase().includes(searchTerm) ||
        report?.status?.toLowerCase().includes(searchTerm) ||
        report?.forPatientType?.toLowerCase().includes(searchTerm) ||
        report?._id?.toLowerCase().includes(searchTerm)
      ));
    }

    // Sort reports
    reports.sort((a, b) => {
      const dateA = new Date(a.scheduledDate || a.createdAt);
      const dateB = new Date(b.scheduledDate || b.createdAt);
      return sortBy === "date" ? dateB - dateA : dateA - dateB;
    });

    return reports;
  }, [labReports, searchQuery, filterStatus, filterTestType, sortBy]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'pending': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'cancelled': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'in-progress': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getUniqueStatuses = () => {
    const statuses = new Set(labReports.map(report => report.status).filter(Boolean));
    return Array.from(statuses);
  };

  const getUniqueTestTypes = () => {
    const types = new Set(labReports.map(report => report.testDetails?.testType).filter(Boolean));
    return Array.from(types);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterStatus("all");
    setFilterTestType("all");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openPDF = (pdfUrl) => {
    window.open(pdfUrl, '_blank');
  };

  const PDFModal = ({ report, onClose }) => {
    if (!report) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 backdrop-blur-xl border border-gray-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-xl font-semibold text-white">Lab Report PDF</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-3">
            <iframe
              src={report.reportPDF}
              className="w-full h-[90vh] rounded-lg border border-gray-700"
              title="Lab Report PDF"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with Search */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg">
                <TestTube className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Lab Reports
              </h1>
            </div>
            <p className="text-gray-400">View and manage your laboratory test results</p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-900/10 border border-gray-700 rounded-xl pl-12 pr-10 py-3 text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none transition-all duration-300 w-80"
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

        {/* AI Summary Section */}
        {labReports.length > 0 && (
          <div className="mb-8 p-6 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-2xl border border-indigo-500/30 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Sparkles className="w-24 h-24 text-purple-400" />
            </div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <BotMessageSquare className="w-6 h-6 text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-white">AI Health Insight</h2>
            </div>

            {loadingSummary ? (
              <div className="flex items-center gap-3 text-gray-400 animate-pulse">
                <Loader className="w-5 h-5 animate-spin" />
                <span>Analyzing your lab reports...</span>
              </div>
            ) : aiSummary ? (
              <div className="prose prose-invert max-w-none text-gray-300 text-sm leading-relaxed relative z-10">
                <ReactMarkdown>{aiSummary}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Unable to generate summary at this time.</p>
            )}
          </div>
        )}

        {/* Filter Controls */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">All Status</option>
              {getUniqueStatuses().map(status => (
                <option key={status} value={status}>
                  {status?.charAt(0).toUpperCase() + status?.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={filterTestType}
              onChange={(e) => setFilterTestType(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">All Test Types</option>
              {getUniqueTestTypes().map(type => (
                <option key={type} value={type}>
                  {type?.charAt(0).toUpperCase() + type?.slice(1)}
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

            {(filterStatus !== "all" || filterTestType !== "all" || searchQuery) && (
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
              {filteredReports.length > 0
                ? `Found ${filteredReports.length} report(s)`
                : `No reports found`}
            </div>
          )}
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports?.map((report, index) => (
            <div
              key={report._id || index}
              className="bg-gray-900 backdrop-blur-xl border border-gray-700 hover:border-emerald-500/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                      {report.status?.charAt(0).toUpperCase() + report.status?.slice(1) || 'Pending'}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {formatDate(report?.scheduledDate || report?.createdAt)}
                      </span>
                    </div>
                    {report.timeSlot && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{report.timeSlot}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setExpandedReportId(expandedReportId === report._id ? null : report._id)}
                    className="flex items-center cursor-pointer gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <span className="text-sm">
                      {expandedReportId === report._id ? 'Hide Details' : 'View Details'}
                    </span>
                    {expandedReportId === report._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-3">
                    {report?.testDetails?.testName && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <TestTube className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{report.testDetails.testName}</p>
                          <p className="text-gray-400 text-sm">{report.testDetails.testType}</p>
                        </div>
                      </div>
                    )}

                    {report?.labId?.name && (
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-cyan-500/20 rounded-lg">
                          <Building2 className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs uppercase tracking-wide">Laboratory</p>
                          <p className="text-white font-medium">{report.labId.name}</p>
                          {report.labId.address && (
                            <p className="text-gray-400 text-sm">{report.labId.address}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <User className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide">Patient Type</p>
                        <p className="text-white font-medium capitalize">{report.forPatientType || 'Self'}</p>
                      </div>
                    </div>

                    {report?.reportPDF && (
                      <div className="flex items-start gap-4 bg-gray-900/40 p-4 rounded-lg ">
                        {/* Icon Box */}
                        <div className="p-2 bg-purple-500/20 rounded-md">
                          <FileText className="w-5 h-5 text-purple-400" />
                        </div>

                        {/* Content Area */}
                        <div className="flex flex-col gap-2">
                          <p className="text-gray-400 text-xs uppercase tracking-wide">Report</p>

                          <div className="flex flex-wrap items-center gap-3">
                            {/* View PDF */}
                            <button
                              onClick={() => setSelectedReport(report)}
                              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              View PDF
                            </button>

                            {/* Open in Tab */}
                            <button
                              onClick={() => openPDF(report.reportPDF)}
                              className="flex items-center gap-1 text-gray-400 hover:text-gray-300 text-sm transition-colors"
                            >
                              {/* <ArrowUpRight className="w-4 h-4" /> */}
                              Open in Tab
                            </button>

                            {/* Download PDF */}
                            <button
                              onClick={() => handleDownload(report.reportPDF)}
                              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                            >
                              <Download className="w-5 h-5" />
                              Download PDF
                            </button>

                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                {/* Expanded Content */}
                {expandedReportId === report._id && (
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Report Details */}
                      <div className="bg-gray-800 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertCircle className="w-5 h-5 text-blue-400" />
                          <h4 className="text-white font-semibold">Report Details</h4>
                        </div>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Report ID:</span>
                            <span className="text-gray-300 font-mono">{report._id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Created:</span>
                            <span className="text-gray-300">{formatDate(report.createdAt)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Issued:</span>
                            <span className="text-gray-300">{formatDate(report.issuedAt)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Last Updated:</span>
                            <span className="text-gray-300">{formatDate(report.updatedAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="bg-gray-800 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <MapPin className="w-5 h-5 text-green-400" />
                          <h4 className="text-white font-semibold">Additional Information</h4>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-300">
                            <span className="text-gray-400">Scheduled for:</span> {formatDate(report.scheduledDate)} at {report.timeSlot}
                          </p>
                          {report.labId?.address && (
                            <p className="text-gray-300">
                              <span className="text-gray-400">Location:</span> {report.labId.address}
                            </p>
                          )}
                          <div className="mt-3">
                            <span className="text-gray-400">Status: </span>
                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(report.status)}`}>
                              {report.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Empty States */}
          {filteredReports.length === 0 && !searchQuery && labReports.length === 0 && (
            <div className="text-center py-16 bg-gray-900 backdrop-blur-xl border border-gray-700 rounded-2xl">
              <div className="max-w-md mx-auto">
                <div className="p-4 bg-gray-500/20 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <TestTube className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Lab Reports</h3>
                <p className="text-gray-400">Your lab reports will appear here once you schedule tests with laboratories.</p>
              </div>
            </div>
          )}

          {filteredReports.length === 0 && (searchQuery || filterStatus !== "all" || filterTestType !== "all") && labReports.length > 0 && (
            <div className="text-center py-16 bg-gray-900 backdrop-blur-xl border border-gray-700 rounded-2xl">
              <div className="max-w-md mx-auto">
                <div className="p-4 bg-gray-500/20 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Reports Found</h3>
                <p className="text-gray-400 mb-4">
                  No reports match your current search criteria. Try adjusting your filters or search terms.
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

      {/* PDF Modal */}
      {selectedReport && (
        <PDFModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
};

export default LabReportComponent;