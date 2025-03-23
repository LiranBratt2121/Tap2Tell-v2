import { LettersData } from "./adminDashboard.types";

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds} sec`;
  }

  return `${minutes} min ${remainingSeconds} sec`;
};

export const formatDate = (dateString: string) => {
  try {
    const [year, month, day] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (e) {
    return dateString; // Return original if parsing fails
  }
};

export const calculateAverageTime = (sortedDailyTimes: [string, number][]) => {
  if (sortedDailyTimes.length === 0) return 0;

  const sum = sortedDailyTimes.reduce((acc, [_, value]) => acc + value, 0);
  return Math.round(sum / sortedDailyTimes.length);
};

export const calculateOverallAccuracy = (lettersData: LettersData) => {
  if (!lettersData || Object.keys(lettersData).length === 0) {
    return 0;
  }

  let totalCorrect = 0;
  let totalAttempts = 0;

  Object.values(lettersData).forEach(letterData => {
    totalCorrect += letterData.correct;
    totalAttempts += letterData.total;
  });

  if (totalAttempts === 0) {
    return 0;
  }

  return Math.round((totalCorrect / totalAttempts) * 100);
};