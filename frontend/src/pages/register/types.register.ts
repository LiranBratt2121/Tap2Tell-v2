export type UserRole = "student" | "teacher" | "";

export type UserInformation = {
    role: UserRole;
    isFirstLogin: boolean;
};