export interface UserProfileData {
    id: string;
    name: string;
    email: string;
    password: string;
    age?: number;
    goal?: number;
    weight?: number;
    height?: number;
    exercise_intensity?: number;
    work_intensity?: number;
}