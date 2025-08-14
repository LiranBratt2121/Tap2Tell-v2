import { useDashboard } from "../../hooks/useDashboard";
import { ErrorMessage, RefreshButton } from "../../v2/adminDashboard.styles";

export const ErrorState: React.FC<{ error: string }> = ({ error }) => {
  const { refreshData } = useDashboard();
  
  return (
    <div style={{ padding: '24px', background: '#f5f7fa', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ color: '#2d3748', fontSize: '2.5rem', fontWeight: '700' }}>לוח בקרה למנהלים</h1>
      </div>
      <ErrorMessage>{error}</ErrorMessage>
      <RefreshButton onClick={refreshData}>נסה שוב</RefreshButton>
    </div>
  );
};
