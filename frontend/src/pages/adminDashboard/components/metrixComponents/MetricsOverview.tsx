import { useDashboard } from "../../hooks/useDashboard";
import { useFormatters } from "../../hooks/useFormatters";
import { SectionTitle, MetricsGrid } from "../../v2/adminDashboard.styles";
import { DashboardMetricCard } from "./DashboardMetrixCard";

export const MetricsOverview: React.FC = () => {
  const { metrics } = useDashboard();
  const { formatNumber, formatPercentage } = useFormatters();

  if (!metrics) return null;

  return (
    <>
      {/* User Statistics */}
      <SectionTitle>סטטיסטיקות משתמשים</SectionTitle>
      <MetricsGrid>
        <DashboardMetricCard
          accent="#667eea"
          value={formatNumber(metrics.totalUsers)}
          label="סה״כ משתמשים"
          description="ספירה של כלל המשתמשים שנרשמו למערכת, ללא קשר לרמת הפעילות שלהם"
        />
        
        <DashboardMetricCard
          accent="#48bb78"
          value={formatNumber(metrics.activeUsers)}
          label="משתמשים פעילים"
          description="מספר המשתמשים שהיו פעילים באפליקציה במהלך 30 הימים האחרונים"
        />
        
        <DashboardMetricCard
          accent="#ed8936"
          value={formatNumber(metrics.teacherUsers)}
          label="מורים"
          description={`${formatPercentage((metrics.teacherUsers / metrics.totalUsers) * 100)} מכלל המשתמשים`}
        />
        
        <DashboardMetricCard
          accent="#9f7aea"
          value={formatNumber(metrics.studentUsers)}
          label="תלמידים"
          description={`${formatPercentage((metrics.studentUsers / metrics.totalUsers) * 100)} מכלל המשתמשים`}
        />
        
        <DashboardMetricCard
          accent="#38b2ac"
          value={formatNumber(metrics.privateUsers)}
          label="משתמשים פרטיים"
          description="משתמשים הלא מוגדרים במערכת כתלמידים/מורים"
        />
      </MetricsGrid>

      {/* Usage Metrics */}
      <SectionTitle>מדדי שימוש</SectionTitle>
      <MetricsGrid>
        <DashboardMetricCard
          accent="#f56565"
          value={`${Math.round(metrics.averageUsageTime)}m`}
          label="זמן שימוש ממוצע"
          description="סך הזמן הממוצע (בדקות) שכל משתמש מבלה באפליקציה -> זמן כללי שנוצל באפליקציה על ידי משתמשים חלקי כמות המשתמשים"
        />
        
        <DashboardMetricCard
          accent="#4299e1"
          value={formatNumber(metrics.dailyActiveUsers)}
          label="פעילים יומיים"
          description="משתמשים פעילים היום"
        />
        
        <DashboardMetricCard
          accent="#805ad5"
          value={formatNumber(metrics.weeklyActiveUsers)}
          label="פעילים שבועיים"
          description="משתמשים פעילים השבוע"
        />
        
        <DashboardMetricCard
          accent="#d69e2e"
          value={`${Math.round(metrics.averageSessionDuration)}m`}
          label="משך הפעלה ממוצע"
          description="משך הזמן הממוצע (בדקות) של סשן בודד של משתמש באפליקציה"
        />
      </MetricsGrid>

      {/* Performance Metrics */}
      <SectionTitle>ביצועי זיהוי אותיות</SectionTitle>
      <MetricsGrid>
        <DashboardMetricCard
          accent="#48bb78"
          value={formatPercentage(metrics.overallAccuracy)}
          label="דיוק כללי"
          description="אחוז הזיהוי הנכון של המערכת"
        />
        
        <DashboardMetricCard
          accent="#667eea"
          value={formatNumber(metrics.totalAttempts)}
          label="סה״כ ניסיונות"
          description="מספר כלל הניסיונות לזיהוי"
        />
        
        <DashboardMetricCard
          accent="#38b2ac"
          value={formatNumber(metrics.correctIdentifications)}
          label="זיהויים נכונים"
          description="מספר הזיהויים המוצלחים"
        />
        
        <DashboardMetricCard
          accent="#f56565"
          value={formatPercentage(metrics.errorRate)}
          label="אחוז שגיאות"
          description="שגיאות בזיהוי האותיות"
        />
      </MetricsGrid>

      {/* Completion Rates */}
      <SectionTitle>אחוזי השלמה</SectionTitle>
      <MetricsGrid>
        {/* <DashboardMetricCard
          accent="#48bb78"
          value={formatPercentage(metrics.completionRates.singleLetter)}
          label="השלמת אות בודדת"
          description="אחוז המשתמשים שהשלימו את תהליך זיהוי אות אחת במלואו (צילום, זיהוי וקבלת פידבק)"
        /> */}
        
        <DashboardMetricCard
          accent="#ed8936"
          value={formatPercentage(metrics.completionRates.allLetters)}
          label="השלמת כל האותיות"
          description="אחוז המשתמשים שהשלימו את תהליך הזיהוי של כל 22 האותיות של האלף-בית"
        />
        
        {/* <DashboardMetricCard
          accent="#9f7aea"
          value={formatPercentage(metrics.completionRates.photoToFeedback)}
          label="מצילום לפידבק"
          description="אחוז המשתמשים שממשיכים בתהליך לאחר צילום האות ועד לקבלת הפידבק הסופי"
        /> */}
      </MetricsGrid>
    </>
  );
};