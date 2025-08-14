import { useEffect, useCallback } from 'react';
import { AdminDashboardManager } from '../v2/manager';
import { useDashboardContext } from '../contexts/DashboardContext';

export const useDashboard = () => {
  const { metrics, loading, error, refreshing, lastUpdated, dispatch } = useDashboardContext();
  const dashboardManager = AdminDashboardManager.getInstance();

  const loadDashboardData = useCallback(async (forceRefresh = false) => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });
      dispatch({ type: 'CLEAR_SEARCH' });
      
      if (forceRefresh) {
        dispatch({ type: 'SET_REFRESHING', payload: true });
      } else {
        dispatch({ type: 'SET_LOADING', payload: true });
      }

      await dashboardManager.initialize(forceRefresh);
      const dashboardMetrics = dashboardManager.getMetrics();

      if (dashboardMetrics) {
        dispatch({ type: 'SET_METRICS', payload: dashboardMetrics });
        dispatch({ type: 'SET_LAST_UPDATED', payload: new Date() });
      } else {
        throw new Error('לא הצלחנו להביא את הנתונים ממסד הנתונים');
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      const errorMessage = err instanceof Error ? err.message : 'שגיאה בטעינת הנתונים';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'SET_REFRESHING', payload: false });
    }
  }, [dispatch, dashboardManager]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const refreshData = useCallback(() => {
    loadDashboardData(true);
  }, [loadDashboardData]);

  return {
    metrics,
    loading,
    error,
    refreshing,
    lastUpdated,
    refreshData,
  };
};
