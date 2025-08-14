import React from 'react';
import { useDashboard } from './hooks/useDashboard';
import { Title } from '../login/styles.login';
import { LetterPerformance } from './components/analyticsComponents/LetterPerformence';
import { UsageTrends } from './components/analyticsComponents/UsageTrends';
import { DashboardHeader } from './components/headerComponents/DashboardHeader';
import { MetricsOverview } from './components/metrixComponents/MetricsOverview';
import { UserSearch } from './components/searchComponents/UserSearch';
import { ErrorState } from './components/stateComponents/ErrorState';
import { LoadingState } from './components/stateComponents/LoadingState';
import { DashboardProvider } from './contexts/DashboardContext';
import { DashboardContainer, Header } from './v2/adminDashboard.styles';

const AdminDashboard: React.FC = () => {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
};

const DashboardContent: React.FC = () => {
  const { metrics, loading, error } = useDashboard();

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!metrics) {
    return <ErrorState error="אין נתונים להצגה" />;
  }

  return (
    <DashboardContainer>
      <Header>
        <Title>לוח בקרה למנהלים</Title>
      </Header>

      <DashboardHeader />
      <UserSearch />
      <MetricsOverview />
      <LetterPerformance />
      <UsageTrends />
    </DashboardContainer>
  );
};

export default AdminDashboard;