import { useState, useEffect, useRef } from 'react';
import { getFirestore, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

/**
 * A hook that tracks active time on the app and saves it to Firestore
 * Tracks both total time and time per day
 * @returns The current tracked session time and total times
 */
const useTimeTracker = () => {
  const db = getFirestore(); // Get Firestore instance
  const auth = getAuth(); // Get Auth instance
  
  const [sessionTime, setSessionTime] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [todayTime, setTodayTime] = useState<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const isActiveRef = useRef<boolean>(true);

  // Helper to get today's date in YYYY-MM-DD format
  const getTodayDateString = (): string => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  // Function to update times in Firestore
  const updateTimes = async (timeInSeconds: number) => {
    if (timeInSeconds <= 0 || !auth.currentUser) return;
    
    const userId = auth.currentUser.uid;
    const todayDate = getTodayDateString();
    
    try {
      const docRef = doc(db, 'userActivity', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const currentTotal = userData.totalActiveTime || 0;
        const newTotal = currentTotal + timeInSeconds;
        
        // Get daily times or initialize if not exists
        const dailyTimes = userData.dailyTimes || {};
        const todayCurrentTime = dailyTimes[todayDate] || 0;
        const todayNewTime = todayCurrentTime + timeInSeconds;
        
        // Update document with both total time and today's time
        await updateDoc(docRef, {
          totalActiveTime: newTotal,
          [`dailyTimes.${todayDate}`]: todayNewTime,
          lastUpdated: new Date()
        });
        
        setTotalTime(newTotal);
        setTodayTime(todayNewTime);
      } else {
        // Create new document if it doesn't exist
        const dailyTimes = {
          [todayDate]: timeInSeconds
        };
        
        await setDoc(docRef, {
          userId,
          totalActiveTime: timeInSeconds,
          dailyTimes,
          lastUpdated: new Date(),
          createdAt: new Date()
        });
        
        setTotalTime(timeInSeconds);
        setTodayTime(timeInSeconds);
      }
      
      console.log(`Updated times: +${timeInSeconds}s, Total: ${totalTime + timeInSeconds}s, Today: ${todayTime + timeInSeconds}s`);
    } catch (error) {
      console.error('Error updating times:', error);
    }
  };

  // Handle active time tracking
  useEffect(() => {
    // Fetch initial times
    const fetchTimes = async () => {
      if (!auth.currentUser) return;
      
      try {
        const docRef = doc(db, 'userActivity', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const userData = docSnap.data();
          
          // Set total time
          if (userData.totalActiveTime) {
            setTotalTime(userData.totalActiveTime);
          }
          
          // Set today's time if it exists
          const todayDate = getTodayDateString();
          if (userData.dailyTimes && userData.dailyTimes[todayDate]) {
            setTodayTime(userData.dailyTimes[todayDate]);
          }
        }
      } catch (error) {
        console.error('Error fetching times:', error);
      }
    };

    fetchTimes();
    
    // Handle visibility change (tab focus/blur)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, stop the timer and update time
        if (startTimeRef.current !== null) {
          const now = Date.now();
          const elapsedSeconds = Math.floor((now - startTimeRef.current) / 1000);
          
          if (elapsedSeconds > 0) {
            setSessionTime(prev => prev + elapsedSeconds);
            updateTimes(elapsedSeconds);
          }
          
          startTimeRef.current = null;
          isActiveRef.current = false;
        }
      } else {
        // Page is visible again, restart the timer
        startTimeRef.current = Date.now();
        isActiveRef.current = true;
      }
    };
    
    // Handle window focus/blur
    const handleWindowFocus = () => {
      startTimeRef.current = Date.now();
      isActiveRef.current = true;
    };
    
    const handleWindowBlur = () => {
      if (startTimeRef.current !== null) {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - startTimeRef.current) / 1000);
        
        if (elapsedSeconds > 0) {
          setSessionTime(prev => prev + elapsedSeconds);
          updateTimes(elapsedSeconds);
        }
        
        startTimeRef.current = null;
        isActiveRef.current = false;
      }
    };
    
    // Set up event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('blur', handleWindowBlur);
    
    // Initialize the timer
    startTimeRef.current = Date.now();
    
    // Cleanup function
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('blur', handleWindowBlur);
      
      // Save final elapsed time before unmounting
      if (isActiveRef.current && startTimeRef.current !== null) {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - startTimeRef.current) / 1000);
        
        if (elapsedSeconds > 0) {
          updateTimes(elapsedSeconds);
        }
      }
    };
  }, []);
  
  // Helper functions to format time
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return hours > 0 
      ? `${hours}h ${minutes}m ${secs}s`
      : `${minutes}m ${secs}s`;
  };
  
  return {
    sessionTime,
    totalTime,
    todayTime,
    formatTime
  };
};

export default useTimeTracker;