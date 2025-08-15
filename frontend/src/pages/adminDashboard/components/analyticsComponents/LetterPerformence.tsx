import { useDashboard } from "../../hooks/useDashboard";
import { useFormatters } from "../../hooks/useFormatters";
import { HEBREW_LETTER_NAMES } from "../../v2/adminDashboard.constants";
import { SectionTitle, LetterGrid, LetterCard, LetterName, LetterStats, ChartsContainer, ChartCard, ChartTitle, TrendsList, TrendItem, TrendDate, TrendValue } from "../../v2/adminDashboard.styles";
import { AdminDashboardManager } from "../../manager";

export const LetterPerformance: React.FC = () => {
  const { metrics } = useDashboard();
  const { formatPercentage, formatNumber, getPerformanceLevel } = useFormatters();
  const dashboardManager = AdminDashboardManager.getInstance();

  if (!metrics) return null;

  return (
    <>
      <SectionTitle>ביצועים לפי אותיות</SectionTitle>
      <LetterGrid>
        {metrics.letterPerformance.map((letter) => (
          <LetterCard key={letter.letter} performance={getPerformanceLevel(letter.accuracy)}>
            <LetterName>{HEBREW_LETTER_NAMES[letter.letter] || letter.letter}</LetterName>
            <LetterStats>
              <div>דיוק: {formatPercentage(letter.accuracy)}</div>
              <div>ניסיונות: {formatNumber(letter.totalAttempts)}</div>
              <div>הצלחות: {formatNumber(letter.correctAttempts)}</div>
            </LetterStats>
          </LetterCard>
        ))}
      </LetterGrid>

      {/* Performance Analysis Charts */}
      <SectionTitle>ניתוח ביצועים</SectionTitle>
      <ChartsContainer>
        <ChartCard>
          <ChartTitle>ביצועים גבוהים (5 אותיות מובילות)</ChartTitle>
          <TrendsList>
            {dashboardManager.getTopPerformingLetters(5).map((letter) => (
              <TrendItem key={letter.letter}>
                <TrendDate>{HEBREW_LETTER_NAMES[letter.letter] || letter.letter}</TrendDate>
                <TrendValue>{formatPercentage(letter.accuracy)}</TrendValue>
              </TrendItem>
            ))}
          </TrendsList>
        </ChartCard>

        <ChartCard>
          <ChartTitle>זקוקות לשיפור (5 אותיות מאתגרות)</ChartTitle>
          <TrendsList>
            {dashboardManager.getWorstPerformingLetters(5).map((letter) => (
              <TrendItem key={letter.letter}>
                <TrendDate>{HEBREW_LETTER_NAMES[letter.letter] || letter.letter}</TrendDate>
                <TrendValue>{formatPercentage(letter.accuracy)}</TrendValue>
              </TrendItem>
            ))}
          </TrendsList>
        </ChartCard>

        <ChartCard>
          <ChartTitle>אותיות פופולריות (5 הנפוצות)</ChartTitle>
          <TrendsList>
            {dashboardManager.getMostAttemptedLetters(5).map((letter) => (
              <TrendItem key={letter.letter}>
                <TrendDate>{HEBREW_LETTER_NAMES[letter.letter] || letter.letter}</TrendDate>
                <TrendValue>{formatNumber(letter.totalAttempts)} ניסיונות</TrendValue>
              </TrendItem>
            ))}
          </TrendsList>
        </ChartCard>

        <ChartCard>
          <ChartTitle>מגמות יומיות (7 ימים אחרונים)</ChartTitle>
          <TrendsList>
            {metrics.timeBasedMetrics.dailyTrends.slice(-7).map((trend) => (
              <TrendItem key={trend.date}>
                <TrendDate>{new Date(trend.date).toLocaleDateString('he-IL')}</TrendDate>
                <TrendValue>{formatNumber(trend.activeUsers)} משתמשים</TrendValue>
              </TrendItem>
            ))}
          </TrendsList>
        </ChartCard>
      </ChartsContainer>
    </>
  );
};