import { useCallback } from "react";
import { AdminDashboardManager } from "../v2/manager";

// Utility hooks for formatting
export const useFormatters = () => {
  const dashboardManager = AdminDashboardManager.getInstance();

  const formatNumber = useCallback((num: number): string => {
    return new Intl.NumberFormat('he-IL').format(Math.round(num));
  }, []);

  const formatPercentage = useCallback((num: number): string => {
    return `${Math.round(num)}%`;
  }, []);

  const formatTime = useCallback((seconds: number): string => {
    return dashboardManager.formatTimeForDisplay(seconds);
  }, [dashboardManager]);

  const formatDate = useCallback((date: Date | any): string => {
    if (!date) return 'N/A';
    try {
      const jsDate = date instanceof Date ? date : new Date((date.seconds || 0) * 1000);
      if (isNaN(jsDate.getTime())) return 'Invalid Date';
      return jsDate.toLocaleString('he-IL');
    } catch (e) {
      console.error('Error formatting date:', date, e);
      return 'Error Date';
    }
  }, []);

  const getPerformanceLevel = useCallback((accuracy: number): 'good' | 'average' | 'poor' => {
    if (accuracy >= 80) return 'good';
    if (accuracy >= 60) return 'average';
    return 'poor';
  }, []);

  return {
    formatNumber,
    formatPercentage,
    formatTime,
    formatDate,
    getPerformanceLevel,
  };
};