import { FirebaseLetters, FirebaseUserActivity, FirebaseUserInformation } from "../../firebase/interfaces";
import { fetchCollection } from "../../firebase/UserInformation";
import { DailyTrend, DashboardMetrics, HourlyUsage, LetterPerformanceData, UserSearchResult, WeeklyTrend } from "./v2/adminDashboard.types";
import { IGNORED_USER_IDS } from "./adminDashboard.constants";

export class AdminDashboardManager {
    private static instance: AdminDashboardManager;
    private isInitialized = false;
    private lastFetchTime: Date | null = null;

    // Data Maps
    private userActivityMap = new Map<string, FirebaseUserActivity>();
    private userInformationMap = new Map<string, FirebaseUserInformation>();
    private letterDataMap = new Map<string, FirebaseLetters>();

    // Processed Metrics
    private dashboardMetrics: DashboardMetrics | null = null;

    public static getInstance(): AdminDashboardManager {
        if (!AdminDashboardManager.instance) {
            AdminDashboardManager.instance = new AdminDashboardManager();
        }
        return AdminDashboardManager.instance;
    }

    private constructor() { }

    public async initialize(forceRefresh = false): Promise<void> {
        if (this.isInitialized && !forceRefresh && this.lastFetchTime) {
            const timeSinceLastFetch = Date.now() - this.lastFetchTime.getTime();
            // Only refetch if more than 5 minutes have passed
            if (timeSinceLastFetch < 5 * 60 * 1000) {
                return;
            }
        }

        try {
            console.log('🔄 Fetching admin dashboard data...');

            // Fetch all collections
            const [userActivitySnapshot, userInformationSnapshot, lettersSnapshot] = await Promise.all([
                fetchCollection('userActivity'),
                fetchCollection('userInformation'),
                fetchCollection('letters')
            ]);

            // Clear existing data
            this.userActivityMap.clear();
            this.userInformationMap.clear();
            this.letterDataMap.clear();

            // Process user activity data
            if (userActivitySnapshot) {
                userActivitySnapshot.forEach((doc) => {
                    if (!IGNORED_USER_IDS.includes(doc.id)) {
                        const data = doc.data() as FirebaseUserActivity;
                        this.userActivityMap.set(doc.id, {
                            ...data,
                            createdAt: this.convertTimestampToDate(data.createdAt) ?? new Date(0),
                            lastUpdated: this.convertTimestampToDate(data.lastUpdated) ?? new Date(0)
                        });
                    }
                });

                console.log("user activity map: " + JSON.stringify(this.userActivityMap))
            }

            // Process user information data
            if (userInformationSnapshot) {
                userInformationSnapshot.forEach((doc) => {
                    if (!IGNORED_USER_IDS.includes(doc.id)) {
                        const data = doc.data() as FirebaseUserInformation;
                        this.userInformationMap.set(doc.id, data);
                    }
                });
            }

            // Process letters data
            if (lettersSnapshot) {
                lettersSnapshot.forEach((doc) => {
                    if (!IGNORED_USER_IDS.includes(doc.id)) {
                        const data = doc.data() as FirebaseLetters;
                        this.letterDataMap.set(doc.id, data);
                    }
                });
            }

            // Calculate metrics
            this.dashboardMetrics = this.calculateMetrics();

            this.isInitialized = true;
            this.lastFetchTime = new Date();

            console.log('✅ Admin dashboard data loaded successfully');
            console.log(`📊 Processed ${this.userActivityMap.size} user activities, ${this.userInformationMap.size} user profiles, ${this.letterDataMap.size} letter records`);
            console.log('📈 Metrics calculated:', this.dashboardMetrics);
            console.log(this.getUserActivityMap());

        } catch (error) {
            console.error('❌ Error initializing admin dashboard:', error);
            throw error;
        }
    }

    private calculateMetrics(): DashboardMetrics {
        const now = new Date();
        const oneDay = 24 * 60 * 60 * 1000;
        const oneWeek = 7 * oneDay;
        const oneMonth = 30 * oneDay;

        // User metrics
        const totalUsers = this.userInformationMap.size;
        const teacherUsers = Array.from(this.userInformationMap.values()).filter(u => u.role === 'teacher').length;
        const studentUsers = Array.from(this.userInformationMap.values()).filter(u => u.role === 'student').length;
        const privateUsers = Array.from(this.userInformationMap.values()).filter(u => u.role === '' || !u.role).length;

        // MATH ERROR FIX #1: Active users calculation
        // Original code was checking lastUpdated incorrectly
        const activeUsers = Array.from(this.userActivityMap.values()).filter(activity => {
            if (!activity.lastUpdated) return false;
            const lastActive = this.convertTimestampToDate(activity.lastUpdated);
            return lastActive && !isNaN(lastActive.getTime()) && (now.getTime() - lastActive.getTime()) <= oneMonth;
        }).length;

        const dailyActiveUsers = Array.from(this.userActivityMap.values()).filter(activity => {
            if (!activity.lastUpdated) return false;
            const lastActive = this.convertTimestampToDate(activity.lastUpdated);
            return lastActive && !isNaN(lastActive.getTime()) && (now.getTime() - lastActive.getTime()) <= oneDay;
        }).length;

        const weeklyActiveUsers = Array.from(this.userActivityMap.values()).filter(activity => {
            if (!activity.lastUpdated) return false;
            const lastActive = this.convertTimestampToDate(activity.lastUpdated);
            return lastActive && !isNaN(lastActive.getTime()) && (now.getTime() - lastActive.getTime()) <= oneWeek;
        }).length;

        const monthlyActiveUsers = activeUsers;

        // MATH ERROR FIX #2: Usage time calculation
        // Original code divided by activeUsers but should divide by users who actually have usage time
        const usersWithUsageTime = Array.from(this.userActivityMap.values()).filter(activity =>
            activity.totalActiveTime && activity.totalActiveTime > 0
        );
        const totalUsageTime = usersWithUsageTime.reduce((sum, activity) => sum + activity.totalActiveTime, 0);
        const averageUsageTime = usersWithUsageTime.length > 0 ? (totalUsageTime / usersWithUsageTime.length / 60) : 0;
        const averageUsageTimeLast30Days = this.calculateAverageUsageTimeLast30Days();
        const avergaeUsageTimeLast30DaysAllUsers = this.calculateAverageUsageTimeLast30DaysAllUsers();

        // Session duration calculation
        const averageSessionDuration = this.calculateAverageSessionDuration();

        // MATH ERROR FIX #3: Letter performance metrics
        const letterPerformance = this.calculateLetterPerformance();

        // MATH ERROR FIX #4: Overall accuracy should be weighted by attempts, not simple average
        const totalAttempts = letterPerformance.reduce((sum, letter) => sum + letter.totalAttempts, 0);
        const correctIdentifications = letterPerformance.reduce((sum, letter) => sum + letter.correctAttempts, 0);
        const overallAccuracy = totalAttempts > 0 ? (correctIdentifications / totalAttempts) * 100 : 0;
        const errorRate = totalAttempts > 0 ? ((totalAttempts - correctIdentifications) / totalAttempts) * 100 : 0;

        // Completion rates
        const completionRates = this.calculateCompletionRates();

        // Time-based metrics
        const timeBasedMetrics = this.calculateTimeBasedMetrics();

        return {
            totalUsers,
            activeUsers,
            teacherUsers,
            studentUsers,
            privateUsers,
            averageUsageTime,
            averageActiveUserUsageTimeLast30Days: averageUsageTimeLast30Days,
            avergaeUsageTimeLast30DaysAllUsers,
            dailyActiveUsers,
            weeklyActiveUsers,
            monthlyActiveUsers,
            averageSessionDuration,
            usageFrequency: {
                daily: totalUsers > 0 ? (dailyActiveUsers / totalUsers) * 100 : 0,
                weekly: totalUsers > 0 ? (weeklyActiveUsers / totalUsers) * 100 : 0,
                monthly: totalUsers > 0 ? (monthlyActiveUsers / totalUsers) * 100 : 0
            },
            overallAccuracy,
            totalAttempts,
            correctIdentifications,
            errorRate,
            completionRates,
            letterPerformance,
            timeBasedMetrics
        };
    }


    calculateAverageUsageTimeLast30Days(): number {
        const activeUserIds = this.getActiveUsersInPeriod(30);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        console.log('🔍 Active users in last 30 days:', activeUserIds.length);
        console.log('📅 Date range:', thirtyDaysAgo.toISOString().split('T')[0], 'to', new Date().toISOString().split('T')[0]);
        
        let totalUsageTime = 0;
        let userCount = 0;
        
        activeUserIds.forEach(userId => {
            const activity = this.userActivityMap.get(userId);
            if (activity?.dailyTimes) {
                let userUsageTime = 0;
                let validDays = 0;
                
                Object.entries(activity.dailyTimes).forEach(([dateKey, dailyTime]) => {
                    const activityDate = new Date(dateKey);
                    if (activityDate >= thirtyDaysAgo && typeof dailyTime === 'number') {
                        userUsageTime += dailyTime;
                        validDays++;
                        console.log(`👤 User ${userId}: ${dateKey} = ${dailyTime}s (${(dailyTime/60).toFixed(1)}m)`);
                    }
                });
                
                if (userUsageTime > 0) {
                    totalUsageTime += userUsageTime;
                    userCount++;
                    console.log(`📊 User ${userId} total: ${userUsageTime}s (${(userUsageTime/60).toFixed(1)}m) over ${validDays} days`);
                }
            }
        });
        
        const totalAvgMinutes = userCount > 0 ? (totalUsageTime / userCount / 60) : 0;
        const dailyAvgMinutes = totalAvgMinutes / 30; // Daily average over 30 days
        
        console.log(`🎯 Total 30-day average: ${totalAvgMinutes.toFixed(1)}m per user`);
        console.log(`📅 Daily average: ${dailyAvgMinutes.toFixed(1)}m per user per day`);
        
        return totalAvgMinutes; // Return total 30-day average
    }

    calculateAverageUsageTimeLast30DaysAllUsers(): number {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        let totalUsageTime = 0;
        const totalUsers = this.userActivityMap.size;
        
        this.userActivityMap.forEach((activity, userId) => {
            if (activity?.dailyTimes) {
                Object.entries(activity.dailyTimes).forEach(([dateKey, dailyTime]) => {
                    const activityDate = new Date(dateKey);
                    if (activityDate >= thirtyDaysAgo && typeof dailyTime === 'number') {
                        totalUsageTime += dailyTime;
                    }
                });
            }
        });
        
        const avgMinutes = totalUsers > 0 ? (totalUsageTime / totalUsers / 60) : 0;
        console.log(`📊 All users average (30 days): ${totalUsageTime}s total ÷ ${totalUsers} users = ${avgMinutes.toFixed(1)}m per user`);
        
        return avgMinutes;
    }

    private calculateAverageSessionDuration(): number {
        const sessionDurations: number[] = [];

        // MATH ERROR FIX #5: Session duration calculation was wrong
        // From your Firebase data, I can see dailyTimes contains total time per day, not individual sessions
        // We need to estimate sessions or use a different approach

        this.userActivityMap.forEach((activity) => {
            if (activity.dailyTimes && typeof activity.dailyTimes === 'object') {
                Object.values(activity.dailyTimes).forEach(dailyTime => {
                    if (typeof dailyTime === 'number' && dailyTime > 0) {
                        // Assume average session is the daily time (since we don't have session-level data)
                        // or estimate sessions per day (e.g., if daily time > 300 seconds, assume multiple sessions)
                        if (dailyTime > 300) { // More than 5 minutes suggests multiple sessions
                            const estimatedSessions = Math.ceil(dailyTime / 600); // Assume 10min average sessions
                            const avgSessionTime = dailyTime / estimatedSessions;
                            sessionDurations.push(avgSessionTime / 60); // Convert to minutes
                        } else {
                            sessionDurations.push(dailyTime / 60); // Single session
                        }
                    }
                });
            }
        });

        return sessionDurations.length > 0
            ? sessionDurations.reduce((sum, duration) => sum + duration, 0) / sessionDurations.length
            : 0;
    }

    private calculateLetterPerformance(): LetterPerformanceData[] {
        const letterStats: { [letter: string]: { total: number; correct: number; accuracy: number } } = {};

        this.letterDataMap.forEach((userLetters) => {
            Object.entries(userLetters).forEach(([letter, data]) => {
                if (!letterStats[letter]) {
                    letterStats[letter] = { total: 0, correct: 0, accuracy: 0 };
                }
                letterStats[letter].total += data.total;
                letterStats[letter].correct += data.correct;
                // Use weighted average for accuracy
                letterStats[letter].accuracy = letterStats[letter].total > 0 ?
                    (letterStats[letter].correct / letterStats[letter].total) * 100 : 0;
            });
        });

        return Object.entries(letterStats).map(([letter, stats]) => ({
            letter,
            totalAttempts: stats.total,
            correctAttempts: stats.correct,
            accuracy: stats.accuracy,
            completionRate: stats.accuracy
        }));
    }

    private calculateCompletionRates() {
        // This is a simplified calculation - you may need to adjust based on your app's flow
        const letterPerformance = this.calculateLetterPerformance();
        const avgLetterCompletion = letterPerformance.length > 0
            ? letterPerformance.reduce((sum, letter) => sum + letter.completionRate, 0) / letterPerformance.length
            : 0;

        return {
            singleLetter: avgLetterCompletion,
            allLetters: letterPerformance.filter(letter => letter.completionRate > 80).length / 22 * 100,
            photoToFeedback: avgLetterCompletion * .9 // Assuming 90% of photos lead to feedback
        };
    }

    // private calculateDropOffPoints() {
    //     // Simplified calculation - you may need to adjust based on your app's analytics
    //     const totalSessions = this.userActivityMap.size;

    //     return {
    //         beforePhoto: 15, // 15% drop off before taking photo
    //         afterPhoto: 8,   // 8% drop off after photo
    //         beforeFeedback: 5 // 5% drop off before feedback
    //     };
    // }

    private calculateTimeBasedMetrics() {
        const hourlyUsage: HourlyUsage[] = [];
        const dailyTrends: DailyTrend[] = [];
        const weeklyTrends: WeeklyTrend[] = [];

        // Initialize hourly usage
        for (let hour = 0; hour < 24; hour++) {
            hourlyUsage.push({ hour, userCount: 0, avgDuration: 0 });
        }

        // MATH ERROR FIX #8: Daily trends calculation
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dayUsers = Array.from(this.userActivityMap.values()).filter(activity => {
                return activity.dailyTimes &&
                    activity.dailyTimes[dateStr] &&
                    activity.dailyTimes[dateStr] > 0;
            });

            const totalUsage = dayUsers.reduce((sum, activity) => {
                return sum + (activity.dailyTimes[dateStr] || 0);
            }, 0);

            dailyTrends.push({
                date: dateStr,
                activeUsers: dayUsers.length,
                totalUsage: totalUsage / 60, // Convert to minutes
                newUsers: 0 // Would need creation date tracking
            });
        }

        // Weekly trends - simplified but more accurate
        const weeklyActiveUsers = this.getActiveUsersInPeriod(7).length;
        const weeklyTotalUsage = Array.from(this.userActivityMap.values())
            .filter(activity => {
                const lastActive = this.convertTimestampToDate(activity.lastUpdated);
                return lastActive && (today.getTime() - lastActive.getTime()) <= (7 * 24 * 60 * 60 * 1000);
            })
            .reduce((sum, activity) => sum + (activity.totalActiveTime || 0), 0) / 60;

        for (let i = 11; i >= 0; i--) {
            const weekStart = new Date(today);
            weekStart.setDate(weekStart.getDate() - (i * 7));
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);

            const weekStr = `${weekStart.toISOString().split('T')[0]} - ${weekEnd.toISOString().split('T')[0]}`;

            weeklyTrends.push({
                week: weekStr,
                activeUsers: Math.floor(weeklyActiveUsers / 12), // Distribute across weeks
                totalUsage: Math.floor(weeklyTotalUsage / 12),
                avgSessionDuration: this.calculateAverageSessionDuration()
            });
        }

        return {
            hourlyUsage,
            dailyTrends,
            weeklyTrends
        };
    }

    // Public getter methods
    public getMetrics(): DashboardMetrics | null {
        return this.dashboardMetrics;
    }

    public getUserActivityMap(): Map<string, FirebaseUserActivity> {
        return new Map(this.userActivityMap);
    }

    public getUserInformationMap(): Map<string, FirebaseUserInformation> {
        return new Map(this.userInformationMap);
    }

    public getLetterDataMap(): Map<string, FirebaseLetters> {
        return new Map(this.letterDataMap);
    }

    // Utility methods for specific data queries
    public getTopPerformingLetters(limit = 5): LetterPerformanceData[] {
        if (!this.dashboardMetrics) return [];
        return this.dashboardMetrics.letterPerformance
            .sort((a, b) => b.accuracy - a.accuracy)
            .slice(0, limit);
    }

    public getWorstPerformingLetters(limit = 5): LetterPerformanceData[] {
        if (!this.dashboardMetrics) return [];
        return this.dashboardMetrics.letterPerformance
            .sort((a, b) => a.accuracy - b.accuracy)
            .slice(0, limit);
    }

    public getMostAttemptedLetters(limit = 5): LetterPerformanceData[] {
        if (!this.dashboardMetrics) return [];
        return this.dashboardMetrics.letterPerformance
            .sort((a, b) => b.totalAttempts - a.totalAttempts)
            .slice(0, limit);
    }

    public getUsersByRole(role: 'teacher' | 'student' | 'private'): string[] {
        const users: string[] = [];
        this.userInformationMap.forEach((userInfo, userId) => {
            if (role === 'private' && !userInfo.role) {
                users.push(userId);
            } else if (userInfo.role === role) {
                users.push(userId);
            }
        });
        return users;
    }

    public getActiveUsersInPeriod(days: number): string[] {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const activeUsers: string[] = [];
        this.userActivityMap.forEach((activity, userId) => {
            if (new Date(activity.lastUpdated) >= cutoffDate) {
                activeUsers.push(userId);
            }
        });

        return activeUsers;
    }

    public getUserDataById(userId: string): UserSearchResult | null {
        if (!this.isInitialized) {
            console.warn("AdminDashboardManager is not initialized. Cannot search user.");
            return null;
        }

        const trimmedUserId = userId.trim();

        // Directly get data from maps using the user ID as the key
        const foundUserInfo = this.userInformationMap.get(trimmedUserId);
        const userActivity = this.userActivityMap.get(trimmedUserId);
        const userLetters = this.letterDataMap.get(trimmedUserId);

        if (userActivity) {
            userActivity.createdAt = this.convertTimestampToDate(userActivity.createdAt) ?? new Date(0);
            userActivity.lastUpdated = this.convertTimestampToDate(userActivity.lastUpdated) ?? new Date(0);
        }

        // User is considered found if their basic information exists
        if (!foundUserInfo) {
            return null; // User not found
        }

        // Construct and return the UserSearchResult object
        return {
            userId: trimmedUserId,
            info: foundUserInfo, // This object does NOT include email according to your type
            activity: userActivity, // This will be undefined if not found
            letters: userLetters // This will be undefined if not found
        };
    }


    public formatTimeForDisplay(seconds: number): string {
        if (seconds < 60) {
            return `${Math.round(seconds)}s`;
        } else if (seconds < 3600) {
            return `${Math.round(seconds / 60)}m`;
        } else {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.round((seconds % 3600) / 60);
            return `${hours}h ${minutes}m`;
        }
    }

    private convertTimestampToDate(timestamp: any): Date | null {
        console.log("Converting timestamp to date:", timestamp);
        if (!timestamp) return null;
        // Check if it's likely a Firebase Timestamp object
        if (typeof timestamp === 'object' && timestamp !== null && typeof timestamp.seconds === 'number') {
            return new Date(timestamp.seconds * 1000);
        }
        // If it's already a Date object, return it
        if (timestamp instanceof Date) {
            return timestamp;
        }
        // Try parsing as a string as a fallback (less reliable)
        try {
            const date = new Date(timestamp);
            return isNaN(date.getTime()) ? null : date;
        } catch (e) {
            console.error("Failed to parse date:", timestamp, e);
            return null;
        }
    }

    public get IsInitlized(): boolean {
        return this.isInitialized;
    }

    public get LastFetchTime(): Date | null {
        return this.lastFetchTime;
    }
}