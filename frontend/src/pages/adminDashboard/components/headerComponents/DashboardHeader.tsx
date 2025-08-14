import { useDashboard } from "../../hooks/useDashboard";
import { MetricDescription, RefreshButton } from "../../v2/adminDashboard.styles";

export const DashboardHeader: React.FC = () => {
  const { refreshing, lastUpdated, refreshData } = useDashboard();

  return (
    <>
      {lastUpdated && (
        <MetricDescription style={{ textAlign: 'center', marginTop: '8px' }}>
          עודכן לאחרונה: {lastUpdated.toLocaleString('he-IL')}
        </MetricDescription>
      )}
      <RefreshButton onClick={refreshData} disabled={refreshing}>
        {refreshing ? 'מעדכן...' : 'עדכן נתונים'}
      </RefreshButton>
    </>
  );
};
