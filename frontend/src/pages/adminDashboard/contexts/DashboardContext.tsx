import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { DashboardMetrics, UserSearchResult } from '../v2/adminDashboard.types';

interface DashboardState {
  metrics: DashboardMetrics | null;
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  lastUpdated: Date | null;
  searchResult: UserSearchResult | null;
  searchLoading: boolean;
  searchError: string | null;
}

type DashboardAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_METRICS'; payload: DashboardMetrics }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_REFRESHING'; payload: boolean }
  | { type: 'SET_LAST_UPDATED'; payload: Date }
  | { type: 'SET_SEARCH_RESULT'; payload: UserSearchResult | null }
  | { type: 'SET_SEARCH_LOADING'; payload: boolean }
  | { type: 'SET_SEARCH_ERROR'; payload: string | null }
  | { type: 'CLEAR_SEARCH' };

const initialState: DashboardState = {
  metrics: null,
  loading: true,
  error: null,
  refreshing: false,
  lastUpdated: null,
  searchResult: null,
  searchLoading: false,
  searchError: null,
};

function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_METRICS':
      return { ...state, metrics: action.payload, loading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_REFRESHING':
      return { ...state, refreshing: action.payload };
    case 'SET_LAST_UPDATED':
      return { ...state, lastUpdated: action.payload };
    case 'SET_SEARCH_RESULT':
      return { ...state, searchResult: action.payload, searchLoading: false, searchError: null };
    case 'SET_SEARCH_LOADING':
      return { ...state, searchLoading: action.payload };
    case 'SET_SEARCH_ERROR':
      return { ...state, searchError: action.payload, searchLoading: false, searchResult: null };
    case 'CLEAR_SEARCH':
      return { ...state, searchResult: null, searchError: null, searchLoading: false };
    default:
      return state;
  }
}

interface DashboardContextType extends DashboardState {
  dispatch: React.Dispatch<DashboardAction>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  return (
    <DashboardContext.Provider value={{ ...state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }
  return context;
};