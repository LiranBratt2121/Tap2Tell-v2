import { FirebaseLetters, FirebaseUserActivity, FirebaseUserInformation } from "../../firebase/interfaces";

export interface DashboardMetrics {
    // User Metrics
    totalUsers: number;
    activeUsers: number;
    teacherUsers: number;
    studentUsers: number;
    privateUsers: number;

    // Usage Metrics
    averageUsageTime: number; // in minutes
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;

    // Engagement Metrics
    averageSessionDuration: number; // in minutes
    usageFrequency: {
        daily: number;
        weekly: number;
        monthly: number;
    };

    // Letter Recognition Metrics
    overallAccuracy: number;
    totalAttempts: number;
    correctIdentifications: number;
    errorRate: number;

    // Completion Metrics
    completionRates: {
        singleLetter: number;
        allLetters: number;
        photoToFeedback: number;
    };

    // // Drop-off Analysis
    // dropOffPoints: {
    //     beforePhoto: number;
    //     afterPhoto: number;
    //     beforeFeedback: number;
    // };

    // Letter-specific data
    letterPerformance: LetterPerformanceData[];

    // Time-based analytics
    timeBasedMetrics: {
        hourlyUsage: HourlyUsage[];
        dailyTrends: DailyTrend[];
        weeklyTrends: WeeklyTrend[];
    };
}

export interface LetterPerformanceData {
    letter: string;
    totalAttempts: number;
    correctAttempts: number;
    accuracy: number;
    // averageTime: number;
    completionRate: number;
}

export interface HourlyUsage {
    hour: number;
    userCount: number;
    avgDuration: number;
}

export interface DailyTrend {
    date: string;
    activeUsers: number;
    totalUsage: number; // in minutes
    newUsers: number;
}

export interface WeeklyTrend {
    week: string;
    activeUsers: number;
    totalUsage: number;
    avgSessionDuration: number;
}

export interface UserSearchResult {
    userId: string;
    info: FirebaseUserInformation;
    activity: FirebaseUserActivity | undefined; // User might not have activity yet
    letters: FirebaseLetters | undefined; // User might not have letter data yet
}