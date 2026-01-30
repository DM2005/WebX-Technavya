import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-black flex flex-col">
        {/* Logo Section */}
        <div className="p-6 bg-black border-b border-black">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-800 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700 to-transparent animate-shimmer"></div>
            </div>
            <div className="h-6 bg-gray-800 rounded w-28 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700 to-transparent animate-shimmer"></div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 rounded-lg px-4 py-6 space-y-1">
          {[1, 2, 3, 4, 5, 6].map((item, index) => (
            <div key={item} className={`flex items-center space-x-3 p-3 rounded-lg ${index === 0 ? 'bg-black' : ''}`}>
              <div className="w-5 h-5 bg-gray-700 rounded relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent animate-shimmer"></div>
              </div>
              <div className="h-4 bg-gray-700 rounded w-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent animate-shimmer"></div>
              </div>
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-900">
          <div className="flex items-center space-x-3 p-3">
            <div className="w-5 h-5 bg-gray-700 rounded relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent animate-shimmer"></div>
            </div>
            <div className="h-4 bg-gray-700 rounded w-16 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent animate-shimmer"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-black border-b border-gray-900 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-7 bg-gray-800 rounded w-32 mb-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700 to-transparent animate-shimmer"></div>
              </div>
              <div className="h-4 bg-gray-800 rounded w-40 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700 to-transparent animate-shimmer"></div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-6 h-6 bg-gray-700 rounded relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent animate-shimmer"></div>
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-600 rounded-full"></div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-700 rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent animate-shimmer"></div>
                </div>
                <div className="h-4 bg-gray-700 rounded w-20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          {/* Welcome Section */}
          <div className="bg-gray-900 rounded-lg p-6 mb-6">
            <div className="h-8 bg-gray-800 rounded w-80 mb-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent animate-shimmer"></div>
            </div>
            <div className="h-5 bg-gray-700 rounded w-64 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent animate-shimmer"></div>
            </div>
          </div>

          {/* Health Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-6 h-4 bg-gray-800 rounded relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700 to-transparent animate-shimmer"></div>
                  </div>
                  <div className="px-3 py-1 bg-gray-800 rounded-full">
                    <div className="h-3 bg-gray-700 rounded w-12 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                </div>
                
                <div className="h-8 bg-gray-800 rounded w-16 mb-2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700 to-transparent animate-shimmer"></div>
                </div>
                <div className="h-4 bg-gray-800 rounded w-24 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700 to-transparent animate-shimmer"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming Appointments Section */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gray-700 rounded relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent animate-shimmer"></div>
                </div>
                <div className="h-6 bg-gray-800 rounded w-48 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700 to-transparent animate-shimmer"></div>
                </div>
              </div>
              <div className="w-6 h-6 bg-gray-700 rounded relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent animate-shimmer"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-700 rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent animate-shimmer"></div>
                </div>
                <div>
                  <div className="h-5 bg-gray-700 rounded w-32 mb-2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent animate-shimmer"></div>
                  </div>
                  <div className="h-4 bg-gray-700 rounded w-24 mb-1 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent animate-shimmer"></div>
                  </div>
                  <div className="h-3 bg-gray-700 rounded w-36 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent animate-shimmer"></div>
                  </div>
                </div>
              </div>
              <div>
                <div className="h-4 bg-gray-700 rounded w-20 mb-1 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent animate-shimmer"></div>
                </div>
                <div className="h-4 bg-gray-700 rounded w-24 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Lab Appointments Section */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gray-700 rounded relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent animate-shimmer"></div>
                </div>
                <div className="h-6 bg-gray-800 rounded w-56 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700 to-transparent animate-shimmer"></div>
                </div>
              </div>
              <div className="w-6 h-6 bg-gray-700 rounded relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent animate-shimmer"></div>
              </div>
            </div>
            
            <div className="h-32 bg-gray-800 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700 to-transparent animate-shimmer"></div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default SkeletonLoader;