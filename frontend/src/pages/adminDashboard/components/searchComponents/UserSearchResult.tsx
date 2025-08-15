import { FirebaseLetters } from "../../../../firebase/interfaces";
import { useFormatters } from "../../hooks/useFormatters";
import { HEBREW_LETTER_NAMES } from "../../v2/adminDashboard.constants";
import { UserResultsContainer, SectionTitle, UserInfoCard, MetricLabel, MetricDescription, UserActivityCard, UserLettersCard, ChartTitle, TrendsList, TrendItem, TrendDate, TrendValue, UserLetterGrid, LetterCard, LetterName, LetterStats } from "../../v2/adminDashboard.styles";
import { LetterPerformanceData } from "../../v2/adminDashboard.types";

export const UserSearchResults: React.FC<{ result: any }> = ({ result }) => {
  const { formatDate, formatTime, formatPercentage, formatNumber, getPerformanceLevel } = useFormatters();

  const calculateUserLetterPerformance = (lettersData: FirebaseLetters | undefined): LetterPerformanceData[] => {
    if (!lettersData) return [];
    const performance: LetterPerformanceData[] = [];
    
    Object.keys(lettersData).forEach((letterKey) => {
      const data = lettersData[letterKey as keyof FirebaseLetters];
      if (data && typeof data.total === 'number' && typeof data.correct === 'number') {
        const accuracy = data.total > 0 ? (data.correct / data.total) * 100 : 0;
        performance.push({
          letter: letterKey,
          totalAttempts: data.total,
          correctAttempts: data.correct,
          accuracy: accuracy,
          completionRate: accuracy
        });
      }
    });
    return performance.sort((a, b) => a.letter.localeCompare(b.letter));
  };

  const getUserLettersSorted = (
    lettersData: FirebaseLetters | undefined, 
    sortOrder: 'easiest' | 'difficult', 
    limit = 5
  ): LetterPerformanceData[] => {
    const performance = calculateUserLetterPerformance(lettersData);
    const lettersWithAttempts = performance.filter(l => l.totalAttempts > 0);

    if (sortOrder === 'easiest') {
      return lettersWithAttempts.sort((a, b) => b.accuracy - a.accuracy).slice(0, limit);
    } else {
      return lettersWithAttempts.sort((a, b) => a.accuracy - b.accuracy).slice(0, limit);
    }
  };

  const getLastUsageTimes = (dailyTimes: any, limit = 5) => {
    if (!dailyTimes) return [];
    return Object.entries(dailyTimes)
      .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
      .slice(0, limit)
      .map(([date, time]) => ({
        date: new Date(date).toLocaleDateString('he-IL'),
        time: formatTime(time as number)
      }));
  };

  return (
    <UserResultsContainer>
      <SectionTitle>פרטי משתמש: {result.userId}</SectionTitle>

      {/* User Basic Info */}
      <UserInfoCard>
        <MetricLabel>פרטים כלליים</MetricLabel>
        <MetricDescription>ID: {result.userId}</MetricDescription>
        {(result.info as any).email && (
          <MetricDescription>אימייל: {(result.info as any).email}</MetricDescription>
        )}
        <MetricDescription>תפקיד: {result.info.role || 'פרטי'}</MetricDescription>
        <MetricDescription>נוצר בתאריך: {formatDate(result.activity?.createdAt)}</MetricDescription>
      </UserInfoCard>

      {/* User Activity */}
      {result.activity ? (
        <UserActivityCard>
          <MetricLabel>פעילות</MetricLabel>
          <MetricDescription>סה"כ זמן שימוש: {formatTime(result.activity.totalActiveTime)}</MetricDescription>
          <MetricDescription>עודכן לאחרונה: {formatDate(result.activity.lastUpdated)}</MetricDescription>
          
          {/* Last 5 Usage Times */}
          {result.activity.dailyTimes && (
            <>
              <ChartTitle style={{ marginTop: '16px', marginBottom: '8px' }}>5 זמני שימוש אחרונים</ChartTitle>
              <TrendsList>
                {getLastUsageTimes(result.activity.dailyTimes).map((usage, index) => (
                  <TrendItem key={index}>
                    <TrendDate>{usage.date}</TrendDate>
                    <TrendValue>{usage.time}</TrendValue>
                  </TrendItem>
                ))}
              </TrendsList>
            </>
          )}
        </UserActivityCard>
      ) : (
        <UserActivityCard>
          <MetricLabel>פעילות</MetricLabel>
          <MetricDescription>אין נתוני פעילות עבור משתמש זה.</MetricDescription>
        </UserActivityCard>
      )}

      {/* User Letter Performance */}
      {result.letters ? (
        <UserLettersCard>
          <MetricLabel>ביצועי אותיות</MetricLabel>
          
          {/* Most Difficult Letters */}
          <ChartTitle style={{ marginTop: '16px', marginBottom: '8px' }}>
            אותיות מאתגרות (מעל 0 ניסיונות)
          </ChartTitle>
          <TrendsList>
            {getUserLettersSorted(result.letters, 'difficult', 5).map((letter) => (
              <TrendItem key={letter.letter}>
                <TrendDate>{HEBREW_LETTER_NAMES[letter.letter] || letter.letter}</TrendDate>
                <TrendValue>
                  {formatPercentage(letter.accuracy)} דיוק ({formatNumber(letter.totalAttempts)} ניסיונות)
                </TrendValue>
              </TrendItem>
            ))}
            {getUserLettersSorted(result.letters, 'difficult', 5).length === 0 && (
              <MetricDescription style={{ textAlign: 'center' }}>
                אין נתונים על אותיות מאתגרות עבור משתמש זה (ייתכן שאין לו ניסיונות).
              </MetricDescription>
            )}
          </TrendsList>

          {/* Easiest Letters */}
          <ChartTitle style={{ marginTop: '24px', marginBottom: '8px' }}>
            אותיות קלות (מעל 0 ניסיונות)
          </ChartTitle>
          <TrendsList>
            {getUserLettersSorted(result.letters, 'easiest', 5).map((letter) => (
              <TrendItem key={letter.letter}>
                <TrendDate>{HEBREW_LETTER_NAMES[letter.letter] || letter.letter}</TrendDate>
                <TrendValue>
                  {formatPercentage(letter.accuracy)} דיוק ({formatNumber(letter.totalAttempts)} ניסיונות)
                </TrendValue>
              </TrendItem>
            ))}
            {getUserLettersSorted(result.letters, 'easiest', 5).length === 0 && (
              <MetricDescription style={{ textAlign: 'center' }}>
                אין נתונים על אותיות קלות עבור משתמש זה (ייתכן שאין לו ניסיונות).
              </MetricDescription>
            )}
          </TrendsList>

          {/* All Letters Grid */}
          <ChartTitle style={{ marginTop: '24px', marginBottom: '16px' }}>כלל האותיות</ChartTitle>
          <UserLetterGrid>
            {calculateUserLetterPerformance(result.letters).map((letter) => (
              <LetterCard key={letter.letter} performance={getPerformanceLevel(letter.accuracy)}>
                <LetterName>{HEBREW_LETTER_NAMES[letter.letter] || letter.letter}</LetterName>
                <LetterStats>
                  <div>דיוק: {formatPercentage(letter.accuracy)}</div>
                  <div>ניסיונות: {formatNumber(letter.totalAttempts)}</div>
                  <div>הצלחות: {formatNumber(letter.correctAttempts)}</div>
                </LetterStats>
              </LetterCard>
            ))}
          </UserLetterGrid>
        </UserLettersCard>
      ) : (
        <UserLettersCard>
          <MetricLabel>ביצועי אותיות</MetricLabel>
          <MetricDescription>אין נתוני ביצועי אותיות עבור משתמש זה.</MetricDescription>
        </UserLettersCard>
      )}
    </UserResultsContainer>
  );
};