import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/stats`, { withCredentials: true });
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch admin stats', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {stats ? (
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 border rounded">
            <div className="text-sm text-gray-500">Total Users</div>
            <div className="text-xl font-semibold">{stats.users}</div>
          </div>
          <div className="p-4 border rounded">
            <div className="text-sm text-gray-500">Hospitals</div>
            <div className="text-xl font-semibold">{stats.hospitals}</div>
          </div>
          <div className="p-4 border rounded">
            <div className="text-sm text-gray-500">Patients</div>
            <div className="text-xl font-semibold">{stats.patients}</div>
          </div>
        </div>
      ) : (
        <div>Loading stats...</div>
      )}
    </div>
  );
};

export default AdminDashboard;
