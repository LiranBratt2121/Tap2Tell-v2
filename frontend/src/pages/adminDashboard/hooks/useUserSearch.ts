import { useCallback } from "react";
import { useDashboardContext } from "../contexts/DashboardContext";
import { AdminDashboardManager } from "../manager";

export const useUserSearch = () => {
  const { searchResult, searchLoading, searchError, dispatch } = useDashboardContext();
  const dashboardManager = AdminDashboardManager.getInstance();

  const searchUser = useCallback(async (userId: string) => {
    if (!userId.trim()) {
      dispatch({ type: 'SET_SEARCH_ERROR', payload: 'אנא הכנס User ID לחיפוש.' });
      return;
    }

    dispatch({ type: 'SET_SEARCH_LOADING', payload: true });
    dispatch({ type: 'SET_SEARCH_ERROR', payload: null });

    // Ensure manager is initialized
    if (!dashboardManager.IsInitlized) {
      try {
        await dashboardManager.initialize(false);
      } catch (initErr) {
        console.error('Error initializing manager before search:', initErr);
        dispatch({ type: 'SET_SEARCH_ERROR', payload: 'שגיאה בהכנת הנתונים לחיפוש. נסה לרענן את הדף.' });
        return;
      }
    }

    try {
      const userData = dashboardManager.getUserDataById(userId);
      if (userData) {
        dispatch({ type: 'SET_SEARCH_RESULT', payload: userData });
      } else {
        dispatch({ type: 'SET_SEARCH_ERROR', payload: `משתמש עם User ID "${userId}" לא נמצא.` });
      }
    } catch (err) {
      console.error('Error during user search:', err);
      dispatch({ type: 'SET_SEARCH_ERROR', payload: 'שגיאה בחיפוש המשתמש.' });
    } finally {
      dispatch({ type: 'SET_SEARCH_LOADING', payload: false });
    }
  }, [dispatch, dashboardManager]);

  const clearSearch = useCallback(() => {
    dispatch({ type: 'CLEAR_SEARCH' });
  }, [dispatch]);

  return {
    searchResult,
    searchLoading,
    searchError,
    searchUser,
    clearSearch,
  };
};

