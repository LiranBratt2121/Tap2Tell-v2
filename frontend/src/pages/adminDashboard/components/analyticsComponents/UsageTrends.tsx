import { useDashboard } from "../../hooks/useDashboard";
import { useFormatters } from "../../hooks/useFormatters";
import { SectionTitle, MetricsGrid } from "../../v2/adminDashboard.styles";
import { DashboardMetricCard } from "../metrixComponents/DashboardMetrixCard";

export const UsageTrends: React.FC = () => {
  const { metrics } = useDashboard();
  const { formatPercentage } = useFormatters();

  if (!metrics) return null;

  return (
    <>
      <SectionTitle>תדירות שימוש</SectionTitle>
      <MetricsGrid>
        <DashboardMetricCard
          accent="#48bb78"
          value={formatPercentage(metrics.usageFrequency.daily)}
          label="שימוש יומי"
          description="אחוז המשתמשים הפעילים מדי יום"
        />
        
        <DashboardMetricCard
          accent="#667eea"
          value={formatPercentage(metrics.usageFrequency.weekly)}
          label="שימוש שבועי"
          description="אחוז המשתמשים הפעילים שבועית"
        />
        
        <DashboardMetricCard
          accent="#9f7aea"
          value={formatPercentage(metrics.usageFrequency.monthly)}
          label="שימוש חודשי"
          description="אחוז המשתמשים הפעילים חודשית"
        />
      </MetricsGrid>
    </>
  );
};