import { MetricCard, MetricValue, MetricLabel, MetricDescription } from "../../v2/adminDashboard.styles";

export const DashboardMetricCard: React.FC<{
    value: string | number;
    label: string;
    description?: string;
    accent?: string;
}> = ({ value, label, description, accent }) => (
    <MetricCard accent={accent}>
        <MetricValue>{value}</MetricValue>
        <MetricLabel>{label}</MetricLabel>
        {description && <MetricDescription>{description}</MetricDescription>}
    </MetricCard>
);