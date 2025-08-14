import { LoadingSpinner } from "../../v2/adminDashboard.styles";

export const LoadingState: React.FC = () => (
  <div style={{ padding: '24px', background: '#f5f7fa', minHeight: '100vh' }}>
    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
      <h1 style={{ color: '#2d3748', fontSize: '2.5rem', fontWeight: '700' }}>לוח בקרה למנהלים</h1>
      <p style={{ color: '#718096', fontSize: '1.1rem' }}>מערכת לימוד אותיות עברית</p>
    </div>
    <LoadingSpinner>טוען נתונים...</LoadingSpinner>
  </div>
);