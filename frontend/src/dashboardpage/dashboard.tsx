import React from 'react';
import DashboardNavBar from './dashboard-nav-bar';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-milk-yellow">
      <DashboardNavBar />
      <div className="pt-20">
        {/* Additional dashboard content can go here */}
      </div>
    </div>
  );
};

export default Dashboard;
