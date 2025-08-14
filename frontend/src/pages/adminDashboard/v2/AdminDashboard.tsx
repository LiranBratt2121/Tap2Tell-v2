// import React, { useState, useEffect } from 'react';
// import { AdminDashboardManager } from './manager';
// import { DashboardContainer, Header, Title, Subtitle, LoadingSpinner, ErrorMessage, RefreshButton, MetricDescription, SectionTitle, MetricsGrid, MetricCard, MetricValue, MetricLabel, LetterGrid, LetterCard, LetterName, LetterStats, ChartsContainer, ChartCard, ChartTitle, TrendsList, TrendItem, TrendDate, TrendValue, SearchButton, SearchContainer, SearchInput, UserActivityCard, UserInfoCard, UserLetterCard, UserLetterGrid, UserLettersCard, UserResultsContainer } from './adminDashboard.styles';
// import { DashboardMetrics, LetterPerformanceData, UserSearchResult } from './adminDashboard.types';
// import { HEBREW_LETTER_NAMES } from './adminDashboard.constants';
// import { FirebaseLetters } from '../../../firebase/interfaces';

// const AdminDashboard: React.FC = () => {
//   const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [refreshing, setRefreshing] = useState(false);
//   const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

//   const [searchId, setSearchId] = useState<string>('');
//   const [searchedUserData, setSearchedUserData] = useState<UserSearchResult | null>(null);
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [searchError, setSearchError] = useState<string | null>(null);
//   const dashboardManager = AdminDashboardManager.getInstance();

//   const loadDashboardData = async (forceRefresh = false) => {
//     setSearchedUserData(null);
//     setSearchError(null);

//     try {
//       setError(null);
//       if (forceRefresh) {
//         setRefreshing(true);
//       } else {
//         setLoading(true);
//       }

//       await dashboardManager.initialize(forceRefresh);
//       const dashboardMetrics = dashboardManager.getMetrics();

//       if (dashboardMetrics) {
//         setMetrics(dashboardMetrics);
//         setLastUpdated(new Date());
//       } else {
//         throw new Error('לא הצלחנו להביא את הנתונים מהמסד נתונים');
//       }
//     } catch (err) {
//       console.error('Error loading dashboard data:', err);
//       setError(err instanceof Error ? err.message : 'שגיאה בטעינת הנתונים');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     loadDashboardData();
//   }, []);

//   const getPerformanceLevel = (accuracy: number): 'good' | 'average' | 'poor' => {
//     if (accuracy >= 80) return 'good';
//     if (accuracy >= 60) return 'average';
//     return 'poor';
//   };

//   const formatNumber = (num: number): string => {
//     return new Intl.NumberFormat('he-IL').format(Math.round(num));
//   };

//   const formatPercentage = (num: number): string => {
//     return `${Math.round(num)}%`;
//   };

//   const formatTime = (seconds: number): string => {
//     return dashboardManager.formatTimeForDisplay(seconds);
//   };

//   const formatDate = (date: Date | any): string => {
//     if (!date) return 'N/A';
//     try {
//       // Assume Firebase Timestamp has 'seconds' property
//       const jsDate = date instanceof Date ? date : new Date((date.seconds || 0) * 1000);
//       console.log('Formatting date:', date, '->', jsDate);
//       if (isNaN(jsDate.getTime())) return 'Invalid Date';
//       return jsDate.toLocaleString('he-IL'); // Format using Hebrew locale
//     } catch (e) {
//       console.error('Error formatting date:', date, e);
//       return 'Error Date';
//     }
//   };

//   const calculateUserLetterPerformance = (lettersData: FirebaseLetters | undefined): LetterPerformanceData[] => {
//     if (!lettersData) return [];
//     const performance: LetterPerformanceData[] = [];
//     // Iterate through the letter keys in the FirebaseLetters object
//     Object.keys(lettersData).forEach((letterKey) => {
//       const letter = letterKey; // Simpler approach assuming keys are correct
//       const data = lettersData[letterKey as keyof FirebaseLetters]; // Access data using the key

//       // Ensure data has total and correct properties which are numbers
//       if (data && typeof data.total === 'number' && typeof data.correct === 'number') {
//         const accuracy = data.total > 0 ? (data.correct / data.total) * 100 : 0;
//         performance.push({
//           letter,
//           totalAttempts: data.total,
//           correctAttempts: data.correct,
//           accuracy: accuracy,
//           // averageTime: 0, // Data not available in your FirebaseLetters type
//           completionRate: accuracy // Use accuracy as completion rate for individual letters
//         });
//       }
//     });
//     return performance.sort((a, b) => a.letter.localeCompare(b.letter)); // Sort letters alphabetically
//   };

//   const getUserLettersSorted = (lettersData: FirebaseLetters | undefined, sortOrder: 'easiest' | 'difficult', limit = 5): LetterPerformanceData[] => {
//     const performance = calculateUserLetterPerformance(lettersData);
//     // Filter out letters with 0 attempts before sorting for easiest/difficult
//     const lettersWithAttempts = performance.filter(l => l.totalAttempts > 0);

//     if (sortOrder === 'easiest') {
//       // Sort by accuracy descending (highest accuracy is easiest)
//       return lettersWithAttempts.sort((a, b) => b.accuracy - a.accuracy).slice(0, limit);
//     } else { // 'difficult'
//       // Sort by accuracy ascending (lowest accuracy is most difficult)
//       return lettersWithAttempts.sort((a, b) => a.accuracy - b.accuracy).slice(0, limit);
//     }
//   }

//   const handleSearch = async () => {
//     if (!searchId.trim()) {
//       setSearchError('אנא הכנס User ID לחיפוש.'); // <-- Updated error message
//       setSearchedUserData(null); // Clear previous result
//       return;
//     }

//     setSearchLoading(true);
//     setSearchError(null);
//     setSearchedUserData(null); // Clear previous result

//     // Ensure manager is initialized before attempting search
//     if (!dashboardManager.IsInitlized) {
//       console.log('Manager not initialized for search, attempting initialization...');
//       try {
//         // Initialize without forcing refresh if data is recent
//         await dashboardManager.initialize(false);
//       } catch (initErr) {
//         console.error('Error initializing manager before search:', initErr);
//         setSearchError('שגיאה בהכנת הנתונים לחיפוש. נסה לרענן את הדף.');
//         setSearchLoading(false);
//         return;
//       }
//     }


//     try {
//       // Call the new method to search by ID
//       const userData = dashboardManager.getUserDataById(searchId); // <-- Use searchId and new method
//       if (userData) {
//         setSearchedUserData(userData);
//       } else {
//         setSearchError(`משתמש עם User ID "${searchId}" לא נמצא.`); // <-- Updated error message
//       }
//     } catch (err) {
//       console.error('Error during user search:', err);
//       setSearchError('שגיאה בחיפוש המשתמש.');
//     } finally {
//       setSearchLoading(false);
//     }
//   };



//   if (loading) {
//     return (
//       <DashboardContainer>
//         <Header>
//           <Title>לוח בקרה למנהלים</Title>
//           <Subtitle>מערכת לימוד אותיות עברית</Subtitle>
//         </Header>
//         <LoadingSpinner>טוען נתונים...</LoadingSpinner>
//       </DashboardContainer>
//     );
//   }

//   if (error) {
//     return (
//       <DashboardContainer>
//         <Header>
//           <Title>לוח בקרה למנהלים</Title>
//         </Header>
//         <ErrorMessage>{error}</ErrorMessage>
//         <RefreshButton onClick={() => loadDashboardData(true)}>
//           נסה שוב
//         </RefreshButton>
//       </DashboardContainer>
//     );
//   }

//   if (!metrics) {
//     return (
//       <DashboardContainer>
//         <Header>
//           <Title>לוח בקרה למנהלים</Title>
//         </Header>
//         <ErrorMessage>אין נתונים להצגה</ErrorMessage>
//       </DashboardContainer>
//     );
//   }

//   return (
//     <DashboardContainer>
//       <Header>
//         <Title>לוח בקרה למנהלים</Title>
//         {lastUpdated && (
//           <MetricDescription style={{ textAlign: 'center', marginTop: '8px' }}>
//             עודכן לאחרונה: {lastUpdated.toLocaleString('he-IL')}
//           </MetricDescription>
//         )}
//         <RefreshButton
//           onClick={() => loadDashboardData(true)}
//           disabled={refreshing}
//         >
//           {refreshing ? 'מעדכן...' : 'עדכן נתונים'}
//         </RefreshButton>
//       </Header>

//       {/* --- Add User Search Section --- */}
//       <SectionTitle>חיפוש משתמש לפי User ID</SectionTitle> {/* <-- Updated title */}
//       <SearchContainer>
//         <SearchInput
//           type="text" // <-- Changed type to text for general ID
//           placeholder="הכנס מספר משתמש לחיפוש (USER ID)" // <-- Updated placeholder
//           value={searchId} // <-- Use searchId
//           onChange={(e) => setSearchId(e.target.value)} // <-- Update searchId state
//           // Add Enter key press handler
//           onKeyPress={(e) => { if (e.key === 'Enter') handleSearch(); }}
//           disabled={loading || refreshing || searchLoading} // Disable input while any loading/refreshing is happening
//         />
//         <SearchButton onClick={handleSearch} disabled={loading || refreshing || searchLoading}>
//           {searchLoading ? 'מחפש...' : 'חפש'}
//         </SearchButton>
//       </SearchContainer>
//       {searchError && <ErrorMessage>{searchError}</ErrorMessage>}
//       {searchLoading && <LoadingSpinner>מחפש משתמש...</LoadingSpinner>}

//       {/* --- Add User Search Results Display --- */}
//       {/* Only show this section if we have search results */}
//       {searchedUserData && (
//         <UserResultsContainer>
//           <SectionTitle>פרטי משתמש: {searchedUserData.userId}</SectionTitle> {/* <-- Display User ID */}

//           {/* User Info Card */}
//           <UserInfoCard>
//             <MetricLabel>פרטים כלליים</MetricLabel>
//             <MetricDescription>ID: {searchedUserData.userId}</MetricDescription>
//             {/* CRITICAL WORKAROUND: Display email using type assertion */}
//             {/* This assumes email exists in the Firestore data, even if the TS type doesn't declare it */}
//             {(searchedUserData.info as any).email && (
//               <MetricDescription>אימייל: {(searchedUserData.info as any).email}</MetricDescription>
//             )}
//             <MetricDescription>תפקיד: {searchedUserData.info.role || 'פרטי'}</MetricDescription>
//             {console.log((searchedUserData))}
//             <MetricDescription>נוצר בתאריך: {formatDate(searchedUserData.activity?.createdAt)}</MetricDescription>
//             {/* Add other relevant info fields from searchedUserData.info */}
//           </UserInfoCard>

//           {/* User Activity Card */}
//           {searchedUserData.activity ? (
//             <UserActivityCard>
//               <MetricLabel>פעילות</MetricLabel>
//               <MetricDescription>סה"כ זמן שימוש: {formatTime(searchedUserData.activity.totalActiveTime)}</MetricDescription>
//               <MetricDescription>עודכן לאחרונה: {formatDate(searchedUserData.activity.lastUpdated)}</MetricDescription>
//               {/* Optionally display a summary of dailyTimes here if needed */}
//             </UserActivityCard>
//           ) : (
//             <UserActivityCard><MetricLabel>פעילות</MetricLabel><MetricDescription>אין נתוני פעילות עבור משתמש זה.</MetricDescription></UserActivityCard>
//           )}

//           {/* User Letter Performance Card */}
//           {searchedUserData.letters ? (
//             <UserLettersCard>
//               <MetricLabel>ביצועי אותיות</MetricLabel>

//               {/* Add Most Difficult Letters */}
//               <ChartTitle style={{ marginTop: '16px', marginBottom: '8px' }}>אותיות מאתגרות (מעל 0 ניסיונות)</ChartTitle>
//               <TrendsList>
//                 {getUserLettersSorted(searchedUserData.letters, 'difficult', 5).map((letter) => (
//                   <TrendItem key={letter.letter}>
//                     <TrendDate>{HEBREW_LETTER_NAMES[letter.letter] || letter.letter}</TrendDate>
//                     <TrendValue>{formatPercentage(letter.accuracy)} דיוק ({formatNumber(letter.totalAttempts)} ניסיונות)</TrendValue>
//                   </TrendItem>
//                 ))}
//                 {getUserLettersSorted(searchedUserData.letters, 'difficult', 5).length === 0 && (
//                   <MetricDescription style={{ textAlign: 'center' }}>אין נתונים על אותיות מאתגרות עבור משתמש זה (ייתכן שאין לו ניסיונות).</MetricDescription>
//                 )}
//               </TrendsList>

//               {/* Add Easiest Letters */}
//               <ChartTitle style={{ marginTop: '24px', marginBottom: '8px' }}>אותיות קלות (מעל 0 ניסיונות)</ChartTitle>
//               <TrendsList>
//                 {getUserLettersSorted(searchedUserData.letters, 'easiest', 5).map((letter) => (
//                   <TrendItem key={letter.letter}>
//                     <TrendDate>{HEBREW_LETTER_NAMES[letter.letter] || letter.letter}</TrendDate>
//                     <TrendValue>{formatPercentage(letter.accuracy)} דיוק ({formatNumber(letter.totalAttempts)} ניסיונות)</TrendValue>
//                   </TrendItem>
//                 ))}
//                 {getUserLettersSorted(searchedUserData.letters, 'easiest', 5).length === 0 && (
//                   <MetricDescription style={{ textAlign: 'center' }}>אין נתונים על אותיות קלות עבור משתמש זה (ייתכן שאין לו ניסיונות).</MetricDescription>
//                 )}
//               </TrendsList>


//               <ChartTitle style={{ marginTop: '24px', marginBottom: '16px' }}>כלל האותיות</ChartTitle> {/* Title for the full grid */}
//               <UserLetterGrid> {/* Reuse the grid style */}
//                 {/* Map over the calculated performance for this specific user */}
//                 {calculateUserLetterPerformance(searchedUserData.letters).map((letter) => (
//                   <UserLetterCard // Reuse the letter card style
//                     key={letter.letter}
//                     performance={getPerformanceLevel(letter.accuracy)}
//                   >
//                     <LetterName>
//                       {HEBREW_LETTER_NAMES[letter.letter] || letter.letter}
//                     </LetterName>
//                     <LetterStats>
//                       <div>דיוק: {formatPercentage(letter.accuracy)}</div>
//                       <div>ניסיונות: {formatNumber(letter.totalAttempts)}</div>
//                       <div>הצלחות: {formatNumber(letter.correctAttempts)}</div>
//                     </LetterStats>
//                   </UserLetterCard>
//                 ))}
//               </UserLetterGrid>
//             </UserLettersCard>
//           ) : (
//             <UserLettersCard><MetricLabel>ביצועי אותיות</MetricLabel><MetricDescription>אין נתוני ביצועי אותיות עבור משתמש זה.</MetricDescription></UserLettersCard>
//           )}

//         </UserResultsContainer>
//       )}

//       {/* User Statistics */}
//           <SectionTitle>סטטיסטיקות משתמשים</SectionTitle>
//           <MetricsGrid>
//             <MetricCard accent="#667eea">
//               <MetricValue>{formatNumber(metrics.totalUsers)}</MetricValue>
//               <MetricLabel>סה"כ משתמשים</MetricLabel>
//               <MetricDescription>כלל המשתמשים הרשומים במערכת</MetricDescription>
//             </MetricCard>

//             <MetricCard accent="#48bb78">
//               <MetricValue>{formatNumber(metrics.activeUsers)}</MetricValue>
//               <MetricLabel>משתמשים פעילים</MetricLabel>
//               <MetricDescription>פעילים ב-30 הימים האחרונים</MetricDescription>
//             </MetricCard>

//             <MetricCard accent="#ed8936">
//               <MetricValue>{formatNumber(metrics.teacherUsers)}</MetricValue>
//               <MetricLabel>מורים</MetricLabel>
//               <MetricDescription>{formatPercentage((metrics.teacherUsers / metrics.totalUsers) * 100)} מכלל המשתמשים</MetricDescription>
//             </MetricCard>

//             <MetricCard accent="#9f7aea">
//               <MetricValue>{formatNumber(metrics.studentUsers)}</MetricValue>
//               <MetricLabel>תלמידים</MetricLabel>
//               <MetricDescription>{formatPercentage((metrics.studentUsers / metrics.totalUsers) * 100)} מכלל המשתמשים</MetricDescription>
//             </MetricCard>

//             <MetricCard accent="#38b2ac">
//               <MetricValue>{formatNumber(metrics.privateUsers)}</MetricValue>
//               <MetricLabel>משתמשים פרטיים</MetricLabel>
//               <MetricDescription>לימוד עצמאי בבית</MetricDescription>
//             </MetricCard>
//           </MetricsGrid>

//           {/* Usage Metrics */}
//           <SectionTitle>מדדי שימוש</SectionTitle>
//           <MetricsGrid>
//             <MetricCard accent="#f56565">
//               <MetricValue>{Math.round(metrics.averageUsageTime)}m</MetricValue>
//               <MetricLabel>זמן שימוש ממוצע</MetricLabel>
//               <MetricDescription>דקות ממוצעות לכל משתמש</MetricDescription>
//             </MetricCard>

//             <MetricCard accent="#4299e1">
//               <MetricValue>{formatNumber(metrics.dailyActiveUsers)}</MetricValue>
//               <MetricLabel>פעילים יומיים</MetricLabel>
//               <MetricDescription>משתמשים פעילים היום</MetricDescription>
//             </MetricCard>

//             <MetricCard accent="#805ad5">
//               <MetricValue>{formatNumber(metrics.weeklyActiveUsers)}</MetricValue>
//               <MetricLabel>פעילים שבועיים</MetricLabel>
//               <MetricDescription>משתמשים פעילים השבוע</MetricDescription>
//             </MetricCard>

//             <MetricCard accent="#d69e2e">
//               <MetricValue>{Math.round(metrics.averageSessionDuration)}m</MetricValue>
//               <MetricLabel>משך הפעלה ממוצע</MetricLabel>
//               <MetricDescription>זמן ממוצע לכל הפעלה</MetricDescription>
//             </MetricCard>
//           </MetricsGrid>

//           {/* Recognition Performance */}
//           <SectionTitle>ביצועי זיהוי אותיות</SectionTitle>
//           <MetricsGrid>
//             <MetricCard accent="#48bb78">
//               <MetricValue>{formatPercentage(metrics.overallAccuracy)}</MetricValue>
//               <MetricLabel>דיוק כללי</MetricLabel>
//               <MetricDescription>אחוז הזיהוי הנכון של המערכת</MetricDescription>
//             </MetricCard>

//             <MetricCard accent="#667eea">
//               <MetricValue>{formatNumber(metrics.totalAttempts)}</MetricValue>
//               <MetricLabel>סה"כ ניסיונות</MetricLabel>
//               <MetricDescription>מספר כלל הניסיונות לזיהוי</MetricDescription>
//             </MetricCard>

//             <MetricCard accent="#38b2ac">
//               <MetricValue>{formatNumber(metrics.correctIdentifications)}</MetricValue>
//               <MetricLabel>זיהויים נכונים</MetricLabel>
//               <MetricDescription>מספר הזיהויים המוצלחים</MetricDescription>
//             </MetricCard>

//             <MetricCard accent="#f56565">
//               <MetricValue>{formatPercentage(metrics.errorRate)}</MetricValue>
//               <MetricLabel>אחוז שגיאות</MetricLabel>
//               <MetricDescription>שגיאות בזיהוי האותיות</MetricDescription>
//             </MetricCard>
//           </MetricsGrid>

//           {/* Completion Rates */}
//           <SectionTitle>אחוזי השלמה</SectionTitle>
//           <MetricsGrid>
//             <MetricCard accent="#48bb78">
//               <MetricValue>{formatPercentage(metrics.completionRates.singleLetter)}</MetricValue>
//               <MetricLabel>השלמת אות בודדת</MetricLabel>
//               <MetricDescription>צילום + זיהוי + פידבק</MetricDescription>
//             </MetricCard>

//             <MetricCard accent="#ed8936">
//               <MetricValue>{formatPercentage(metrics.completionRates.allLetters)}</MetricValue>
//               <MetricLabel>השלמת כל האותיות</MetricLabel>
//               <MetricDescription>22 האותיות של האלף-בית</MetricDescription>
//             </MetricCard>

//             <MetricCard accent="#9f7aea">
//               <MetricValue>{formatPercentage(metrics.completionRates.photoToFeedback)}</MetricValue>
//               <MetricLabel>מצילום לפידבק</MetricLabel>
//               <MetricDescription>אחוז המשלימים את התהליך</MetricDescription>
//             </MetricCard>
//           </MetricsGrid>

//           {/* Drop-off Analysis
//       <SectionTitle>ניתוח נקודות נטישה</SectionTitle>
//       <MetricsGrid>
//         <MetricCard accent="#f56565">
//           <MetricValue>{formatPercentage(metrics.dropOffPoints.beforePhoto)}</MetricValue>
//           <MetricLabel>נטישה לפני צילום</MetricLabel>
//           <MetricDescription>משתמשים שיוצאים לפני הצילום</MetricDescription>
//         </MetricCard>
        
//         <MetricCard accent="#ed8936">
//           <MetricValue>{formatPercentage(metrics.dropOffPoints.afterPhoto)}</MetricValue>
//           <MetricLabel>נטישה אחרי צילום</MetricLabel>
//           <MetricDescription>משתמשים שיוצאים אחרי הצילום</MetricDescription>
//         </MetricCard>
        
//         <MetricCard accent="#d69e2e">
//           <MetricValue>{formatPercentage(metrics.dropOffPoints.beforeFeedback)}</MetricValue>
//           <MetricLabel>נטישה לפני פידבק</MetricLabel>
//           <MetricDescription>משתמשים שלא ממתינים לפידבק</MetricDescription>
//         </MetricCard>
//       </MetricsGrid> */}

//           {/* Letter Performance */}
//           <SectionTitle>ביצועים לפי אותיות</SectionTitle>
//           <LetterGrid>
//             {metrics.letterPerformance.map((letter) => (
//               <LetterCard
//                 key={letter.letter}
//                 performance={getPerformanceLevel(letter.accuracy)}
//               >
//                 <LetterName>
//                   {HEBREW_LETTER_NAMES[letter.letter] || letter.letter}
//                 </LetterName>
//                 <LetterStats>
//                   <div>דיוק: {formatPercentage(letter.accuracy)}</div>
//                   <div>ניסיונות: {formatNumber(letter.totalAttempts)}</div>
//                   <div>הצלחות: {formatNumber(letter.correctAttempts)}</div>
//                 </LetterStats>
//               </LetterCard>
//             ))}
//           </LetterGrid>

//           {/* Usage Trends */}
//           <SectionTitle>מגמות השימוש</SectionTitle>
//           <ChartsContainer>
//             <ChartCard>
//               <ChartTitle>מגמות יומיות (30 ימים אחרונים)</ChartTitle>
//               <TrendsList>
//                 {metrics.timeBasedMetrics.dailyTrends.slice(-7).map((trend) => (
//                   <TrendItem key={trend.date}>
//                     <TrendDate>{new Date(trend.date).toLocaleDateString('he-IL')}</TrendDate>
//                     <TrendValue>{formatNumber(trend.activeUsers)} משתמשים</TrendValue>
//                   </TrendItem>
//                 ))}
//               </TrendsList>
//             </ChartCard>

//             <ChartCard>
//               <ChartTitle>ביצועים גבוהים (5 אותיות מובילות)</ChartTitle>
//               <TrendsList>
//                 {dashboardManager.getTopPerformingLetters(5).map((letter) => (
//                   <TrendItem key={letter.letter}>
//                     <TrendDate>{HEBREW_LETTER_NAMES[letter.letter] || letter.letter}</TrendDate>
//                     <TrendValue>{formatPercentage(letter.accuracy)}</TrendValue>
//                   </TrendItem>
//                 ))}
//               </TrendsList>
//             </ChartCard>

//             <ChartCard>
//               <ChartTitle>זקוקות לשיפור (5 אותיות מאתגרות)</ChartTitle>
//               <TrendsList>
//                 {dashboardManager.getWorstPerformingLetters(5).map((letter) => (
//                   <TrendItem key={letter.letter}>
//                     <TrendDate>{HEBREW_LETTER_NAMES[letter.letter] || letter.letter}</TrendDate>
//                     <TrendValue>{formatPercentage(letter.accuracy)}</TrendValue>
//                   </TrendItem>
//                 ))}
//               </TrendsList>
//             </ChartCard>

//             <ChartCard>
//               <ChartTitle>אותיות פופולריות (5 הנפוצות)</ChartTitle>
//               <TrendsList>
//                 {dashboardManager.getMostAttemptedLetters(5).map((letter) => (
//                   <TrendItem key={letter.letter}>
//                     <TrendDate>{HEBREW_LETTER_NAMES[letter.letter] || letter.letter}</TrendDate>
//                     <TrendValue>{formatNumber(letter.totalAttempts)} ניסיונות</TrendValue>
//                   </TrendItem>
//                 ))}
//               </TrendsList>
//             </ChartCard>
//           </ChartsContainer>

//           {/* Usage Frequency */}
//           <SectionTitle>תדירות שימוש</SectionTitle>
//           <MetricsGrid>
//             <MetricCard accent="#48bb78">
//               <MetricValue>{formatPercentage(metrics.usageFrequency.daily)}</MetricValue>
//               <MetricLabel>שימוש יומי</MetricLabel>
//               <MetricDescription>אחוז המשתמשים הפעילים מדי יום</MetricDescription>
//             </MetricCard>

//             <MetricCard accent="#667eea">
//               <MetricValue>{formatPercentage(metrics.usageFrequency.weekly)}</MetricValue>
//               <MetricLabel>שימוש שבועי</MetricLabel>
//               <MetricDescription>אחוז המשתמשים הפעילים שבועית</MetricDescription>
//             </MetricCard>

//             <MetricCard accent="#9f7aea">
//               <MetricValue>{formatPercentage(metrics.usageFrequency.monthly)}</MetricValue>
//               <MetricLabel>שימוש חודשי</MetricLabel>
//               <MetricDescription>אחוז המשתמשים הפעילים חודשית</MetricDescription>
//             </MetricCard>
//           </MetricsGrid>
//         </DashboardContainer>
//       );
// };

//       export default AdminDashboard;