import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import Login from './pages/login/Login';
import { startFirebase } from './firebase/firebaseConfig';
import Dashboard from './pages/dashboard/Dashboard';
import GlobalStyle from './globalStyles';
import Capture from './pages/capture/Capture';
import Result from './pages/result/Result';
import ProtectedRoute from './protectedRoute';
import Guide from './pages/guide/Guide';
import useTimeTracker from './hooks/useTimeTracker';

startFirebase();

const App: React.FC = () => {
  useTimeTracker();
  
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/capture/:letter"
              element={
                <ProtectedRoute>
                  <Capture />
                </ProtectedRoute>
              }
            />
            <Route
              path="/result"
              element={
                <ProtectedRoute>
                  <Result />
                </ProtectedRoute>
              }
            />
            <Route
              path="guide"
              element={
                <ProtectedRoute>
                  <Guide />
                </ProtectedRoute>
              }
            />            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
};

export default App;
