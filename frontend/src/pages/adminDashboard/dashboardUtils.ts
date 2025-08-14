import { FirebaseLetters } from '../../firebase/interfaces';
import { LetterPerformanceData } from './v2/adminDashboard.types';
import { HEBREW_LETTER_NAMES } from './v2/adminDashboard.constants';

/**
 * Data processing utilities for the admin dashboard
 */

export const formatters = {
  number: (num: number): string => {
    return new Intl.NumberFormat('he-IL').format(Math.round(num));
  },

  percentage: (num: number): string => {
    return `${Math.round(num)}%`;
  },

  date: (date: Date | any): string => {
    if (!date) return 'N/A';
    try {
      const jsDate = date instanceof Date ? date : new Date((date.seconds || 0) * 1000);
      if (isNaN(jsDate.getTime())) return 'Invalid Date';
      return jsDate.toLocaleString('he-IL');
    } catch (e) {
      console.error('Error formatting date:', date, e);
      return 'Error Date';
    }
  },

  time: (seconds: number): string => {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`;
    } else if (seconds < 3600) {
      return `${Math.round(seconds / 60)}m`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.round((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  },
};

export const performance = {
  getLevel: (accuracy: number): 'good' | 'average' | 'poor' => {
    if (accuracy >= 80) return 'good';
    if (accuracy >= 60) return 'average';
    return 'poor';
  },

  calculateUserLetters: (lettersData: FirebaseLetters | undefined): LetterPerformanceData[] => {
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
  },

  getSortedLetters: (
    lettersData: FirebaseLetters | undefined, 
    sortOrder: 'easiest' | 'difficult', 
    limit = 5
  ): LetterPerformanceData[] => {
    const performanceData = performance.calculateUserLetters(lettersData);
    const lettersWithAttempts = performanceData.filter(l => l.totalAttempts > 0);

    if (sortOrder === 'easiest') {
      return lettersWithAttempts.sort((a, b) => b.accuracy - a.accuracy).slice(0, limit);
    } else {
      return lettersWithAttempts.sort((a, b) => a.accuracy - b.accuracy).slice(0, limit);
    }
  },
};

export const validation = {
  isValidUserId: (userId: string): boolean => {
    return userId.trim().length > 0;
  },

  hasValidUserData: (userData: any): boolean => {
    return userData && userData.userId && userData.info;
  },

  hasValidMetrics: (metrics: any): boolean => {
    return metrics && typeof metrics.totalUsers === 'number';
  },
};

export const constants = {
  COLORS: {
    primary: '#667eea',
    success: '#48bb78',
    warning: '#ed8936',
    error: '#f56565',
    info: '#4299e1',
    purple: '#9f7aea',
    teal: '#38b2ac',
  },

  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  
  PERFORMANCE_THRESHOLDS: {
    GOOD: 80,
    AVERAGE: 60,
  },
};

/**
 * Helper function to get Hebrew letter display name
 */
export const getHebrewLetterName = (letterKey: string): string => {
  return HEBREW_LETTER_NAMES[letterKey] || letterKey;
};

/**
 * Calculate user statistics summary
 */
export const calculateUserSummary = (userData: any) => {
  const summary = {
    hasActivity: Boolean(userData.activity),
    hasLetterData: Boolean(userData.letters),
    totalUsageTime: userData.activity?.totalActiveTime || 0,
    lastActive: userData.activity?.lastUpdated,
    letterCount: userData.letters ? Object.keys(userData.letters).length : 0,
  };

  return summary;
};

/**
 * Generate metric card data structure
 */
export const createMetricCard = (
  value: string | number,
  label: string,
  description?: string,
  accent?: string
) => ({
  value,
  label,
  description,
  accent,
});

/**
 * Group metrics by category
 */
export const groupMetrics = (metrics: any) => {
  return {
    users: [
      createMetricCard(
        formatters.number(metrics.totalUsers),
        'סה"כ משתמשים',
        'כלל המשתמשים הרשומים במערכת',
        constants.COLORS.primary
      ),
      createMetricCard(
        formatters.number(metrics.activeUsers),
        'משתמשים פעילים',
        'פעילים ב-30 הימים האחרונים',
        constants.COLORS.success
      ),
      createMetricCard(
        formatters.number(metrics.teacherUsers),
        'מורים',
        `${formatters.percentage((metrics.teacherUsers / metrics.totalUsers) * 100)} מכלל המשתמשים`,
        constants.COLORS.warning
      ),
      createMetricCard(
        formatters.number(metrics.studentUsers),
        'תלמידים',
        `${formatters.percentage((metrics.studentUsers / metrics.totalUsers) * 100)} מכלל המשתמשים`,
        constants.COLORS.purple
      ),
    ],
    usage: [
      createMetricCard(
        `${Math.round(metrics.averageUsageTime)}m`,
        'זמן שימוש ממוצע',
        'דקות ממוצעות לכל משתמש',
        constants.COLORS.error
      ),
      createMetricCard(
        formatters.number(metrics.dailyActiveUsers),
        'פעילים יומיים',
        'משתמשים פעילים היום',
        constants.COLORS.info
      ),
      createMetricCard(
        formatters.percentage(metrics.overallAccuracy),
        'דיוק כללי',
        'אחוז הזיהוי הנכון של המערכת',
        constants.COLORS.success
      ),
      createMetricCard(
        formatters.percentage(metrics.errorRate),
        'אחוז שגיאות',
        'שגיאות בזיהוי האותיות',
        constants.COLORS.error
      ),
    ],
    frequency: [
      createMetricCard(
        formatters.percentage(metrics.usageFrequency.daily),
        'שימוש יומי',
        'אחוז המשתמשים הפעילים מדי יום',
        constants.COLORS.success
      ),
      createMetricCard(
        formatters.percentage(metrics.usageFrequency.weekly),
        'שימוש שבועי',
        'אחוז המשתמשים הפעילים שבועית',
        constants.COLORS.primary
      ),
      createMetricCard(
        formatters.percentage(metrics.usageFrequency.monthly),
        'שימוש חודשי',
        'אחוז המשתמשים הפעילים חודשית',
        constants.COLORS.purple
      ),
    ],
  };
};