import React from 'react';
import DashboardNavBar from './dashboard-nav-bar';
import SummarySection from './summary-section';
import ReviewDetails from './review-details';
import { useAppStore } from '../global-store';

const Dashboard: React.FC = () => {
  const { isSummaryView, setDbSelectedProperty } = useAppStore();

  React.useEffect(() => {
    if (setDbSelectedProperty) {
      setDbSelectedProperty(undefined);
    }
  }, [isSummaryView, setDbSelectedProperty]);

  return (
    <div className="min-h-screen bg-milk-yellow">
      <DashboardNavBar />
      <div className="pt-4">
        {isSummaryView ? <SummarySection /> : <ReviewDetails />}
      </div>
    </div>
  );
};

export default Dashboard;
