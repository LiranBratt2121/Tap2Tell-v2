import { FirebaseLetters, FirebaseUserActivity, FirebaseUserInformation } from "../../firebase/interfaces";
import { fetchCollection } from "../../firebase/UserInformation";
import { DailyTrend, DashboardMetrics, HourlyUsage, LetterPerformanceData, UserSearchResult, WeeklyTrend } from "./adminDashboard.types";

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
                    const data = doc.data() as FirebaseUserActivity;
                    this.userActivityMap.set(doc.id, {
                        ...data,
                        createdAt: this.convertTimestampToDate(data.createdAt) ?? new Date(0),
                        lastUpdated: this.convertTimestampToDate(data.lastUpdated) ?? new Date(0)
                    });
                });
            }

            // Process user information data
            if (userInformationSnapshot) {
                userInformationSnapshot.forEach((doc) => {
                    const data = doc.data() as FirebaseUserInformation;
                    this.userInformationMap.set(doc.id, data);
                });
            }

            // Process letters data
            if (lettersSnapshot) {
                lettersSnapshot.forEach((doc) => {
                    const data = doc.data() as FirebaseLetters;
                    this.letterDataMap.set(doc.id, data);
                });
            }

            // Calculate metrics
            this.dashboardMetrics = this.calculateMetrics();

            this.isInitialized = true;
            this.lastFetchTime = new Date();

            console.log('✅ Admin dashboard data loaded successfully');
            console.log(`📊 Processed ${this.userActivityMap.size} user activities, ${this.userInformationMap.size} user profiles, ${this.letterDataMap.size} letter records`);
            console.log('📈 Metrics calculated:', this.dashboardMetrics);

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
        const privateUsers = totalUsers - teacherUsers - studentUsers;

        // Active users (users who have activity in the last 30 days)
        const activeUsers = Array.from(this.userActivityMap.values()).filter(activity => {
            const lastActive = new Date(activity.lastUpdated);
            return (now.getTime() - lastActive.getTime()) <= oneMonth;
        }).length;

        // Daily, weekly, monthly active users
        const dailyActiveUsers = Array.from(this.userActivityMap.values()).filter(activity => {
            const lastActive = new Date(activity.lastUpdated);
            return (now.getTime() - lastActive.getTime()) <= oneDay;
        }).length;

        const weeklyActiveUsers = Array.from(this.userActivityMap.values()).filter(activity => {
            const lastActive = new Date(activity.lastUpdated);
            return (now.getTime() - lastActive.getTime()) <= oneWeek;
        }).length;

        const monthlyActiveUsers = activeUsers;

        // Usage time calculations
        const totalUsageTime = Array.from(this.userActivityMap.values())
            .reduce((sum, activity) => sum + activity.totalActiveTime, 0);
        const averageUsageTime = activeUsers > 0 ? (totalUsageTime / activeUsers / 60) : 0; // Convert to minutes

        // Session duration calculation
        const averageSessionDuration = this.calculateAverageSessionDuration();

        // Letter performance metrics
        const letterPerformance = this.calculateLetterPerformance();
        const overallAccuracy = letterPerformance.length > 0
            ? letterPerformance.reduce((sum, letter) => sum + letter.accuracy, 0) / letterPerformance.length
            : 0;

        const totalAttempts = letterPerformance.reduce((sum, letter) => sum + letter.totalAttempts, 0);
        const correctIdentifications = letterPerformance.reduce((sum, letter) => sum + letter.correctAttempts, 0);
        const errorRate = totalAttempts > 0 ? ((totalAttempts - correctIdentifications) / totalAttempts) * 100 : 0;

        // Completion rates
        const completionRates = this.calculateCompletionRates();

        // Drop-off analysis
        // const dropOffPoints = this.calculateDropOffPoints();

        // Time-based metrics
        const timeBasedMetrics = this.calculateTimeBasedMetrics();

        return {
            totalUsers,
            activeUsers,
            teacherUsers,
            studentUsers,
            privateUsers,
            averageUsageTime,
            dailyActiveUsers,
            weeklyActiveUsers,
            monthlyActiveUsers,
            averageSessionDuration,
            usageFrequency: {
                daily: (dailyActiveUsers / totalUsers) * 100,
                weekly: (weeklyActiveUsers / totalUsers) * 100,
                monthly: (monthlyActiveUsers / totalUsers) * 100
            },
            overallAccuracy,
            totalAttempts,
            correctIdentifications,
            errorRate,
            completionRates,
            // dropOffPoints,
            letterPerformance,
            timeBasedMetrics
        };
    }

    private calculateAverageSessionDuration(): number {
        const sessionDurations: number[] = [];

        this.userActivityMap.forEach((activity) => {
            Object.values(activity.dailyTimes).forEach(dailyTime => {
                if (dailyTime > 0) {
                    sessionDurations.push(dailyTime / 60); // Convert to minutes
                }
            });
        });

        return sessionDurations.length > 0
            ? sessionDurations.reduce((sum, duration) => sum + duration, 0) / sessionDurations.length
            : 0;
    }

    private calculateLetterPerformance(): LetterPerformanceData[] {
        const letterStats: { [letter: string]: { total: number; correct: number; times: number[] } } = {};

        this.letterDataMap.forEach((userLetters) => {
            Object.entries(userLetters).forEach(([letter, data]) => {
                if (!letterStats[letter]) {
                    letterStats[letter] = { total: 0, correct: 0, times: [] };
                }
                letterStats[letter].total += data.total;
                letterStats[letter].correct += data.correct;
            });
        });

        return Object.entries(letterStats).map(([letter, stats]) => ({
            letter,
            totalAttempts: stats.total,
            correctAttempts: stats.correct,
            accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
            averageTime: stats.times.length > 0 ? stats.times.reduce((a, b) => a + b, 0) / stats.times.length : 0,
            completionRate: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0
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
            photoToFeedback: avgLetterCompletion * 0.9 // Assuming 90% of photos lead to feedback
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

        // Calculate daily trends for the last 30 days
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dayUsers = Array.from(this.userActivityMap.values()).filter(activity =>
                activity.dailyTimes[dateStr] && activity.dailyTimes[dateStr] > 0
            );

            const totalUsage = dayUsers.reduce((sum, activity) => sum + (activity.dailyTimes[dateStr] || 0), 0);

            dailyTrends.push({
                date: dateStr,
                activeUsers: dayUsers.length,
                totalUsage: totalUsage / 60, // Convert to minutes
                newUsers: 0 // You might want to track this separately
            });
        }

        // Calculate weekly trends for the last 12 weeks
        for (let i = 11; i >= 0; i--) {
            const weekStart = new Date(today);
            weekStart.setDate(weekStart.getDate() - (i * 7));
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);

            const weekStr = `${weekStart.toISOString().split('T')[0]} - ${weekEnd.toISOString().split('T')[0]}`;

            // This is a simplified calculation
            weeklyTrends.push({
                week: weekStr,
                activeUsers: Math.floor(this.dashboardMetrics?.weeklyActiveUsers || 0),
                totalUsage: Math.floor((this.dashboardMetrics?.averageUsageTime || 0) * 7),
                avgSessionDuration: this.dashboardMetrics?.averageSessionDuration || 0
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