
import { UserConfig, Achievement, UserGamification } from '../types';
import { differenceInCalendarDays, format, getHours } from 'date-fns';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export const ACHIEVEMENTS: Achievement[] = [
    { id: 'first_step', title: 'First Steps', description: 'Complete your first study task.', icon: '🌱', conditionType: 'task_count', threshold: 1 },
    { id: 'streak_3', title: 'On Fire', description: 'Maintain a 3-day study streak.', icon: '🔥', conditionType: 'streak', threshold: 3 },
    { id: 'streak_7', title: 'Unstoppable', description: 'Maintain a 7-day study streak.', icon: '🚀', conditionType: 'streak', threshold: 7 },
    { id: 'early_bird', title: 'Early Bird', description: 'Complete a task before 8 AM.', icon: '🌅', conditionType: 'early_bird', threshold: 1 },
    { id: 'night_owl', title: 'Night Owl', description: 'Complete a task after 9 PM.', icon: '🦉', conditionType: 'night_owl', threshold: 1 },
    { id: 'mastery_50', title: 'Halfway There', description: 'Reach 50% Syllabus Mastery.', icon: '🎯', conditionType: 'mastery', threshold: 50 },
    { id: 'mastery_100', title: 'Completionist', description: 'Reach 100% Syllabus Mastery.', icon: '🏆', conditionType: 'mastery', threshold: 100 },
];

export const gamificationService = {
    // Call this on app load or daily
    checkStreak(config: UserConfig): UserConfig {
        const today = format(new Date(), 'yyyy-MM-dd');
        const lastDate = config.gamification?.lastStudyDate;

        let newStreak = config.gamification?.streak || 0;
        let points = config.gamification?.points || 0;

        if (!lastDate) {
            // First time or legacy user
            return {
                ...config,
                gamification: {
                    streak: 0,
                    lastStudyDate: '',
                    points: points,
                    unlockedAchievementIds: config.gamification?.unlockedAchievementIds || []
                }
            };
        }

        const diff = differenceInCalendarDays(new Date(today), new Date(lastDate));

        if (diff === 0) {
            // Already visited today, do nothing to streak
        } else if (diff === 1) {
            // Consecutive day, logic handled when they actually COMPLETE a task, 
            // OR we can just increment purely on "Login" if desired. 
            // Let's stick to: Login preserves it, Task increments it.
            // Actually, for simple engagement, Login Streak is fine.
            // Let's implement: Login updates 'lastVisited', if diff=1 increment streak.
            newStreak += 1;
        } else {
            // Missed a day (diff > 1)
            newStreak = 0;
        }

        // Return updated config ONLY if date changed (to avoid write loops)
        if (diff !== 0) {
            return {
                ...config,
                gamification: {
                    ...config.gamification,
                    streak: newStreak,
                    lastStudyDate: today
                }
            };
        }

        return config;
    },

    // Call this when a task is marked done
    checkAchievements(config: UserConfig, masteryScore: number, taskCompletedTime: Date): UserConfig {
        const currentGami = config.gamification || { streak: 0, lastStudyDate: format(new Date(), 'yyyy-MM-dd'), points: 0, unlockedAchievementIds: [] };
        const unlockedIds = new Set(currentGami.unlockedAchievementIds);
        let newPoints = currentGami.points + 10; // +10 points per task

        // Check Streak conditions (in case streak updated)
        ACHIEVEMENTS.filter(a => a.conditionType === 'streak').forEach(a => {
            if (currentGami.streak >= a.threshold) unlockedIds.add(a.id);
        });

        // Check Mastery
        ACHIEVEMENTS.filter(a => a.conditionType === 'mastery').forEach(a => {
            if (masteryScore >= a.threshold) unlockedIds.add(a.id);
        });

        // Check Time specific
        const hour = getHours(taskCompletedTime);
        if (hour < 8) unlockedIds.add('early_bird');
        if (hour >= 21) unlockedIds.add('night_owl');

        // Check First Step (Task Count > 0, which is true if this runs)
        unlockedIds.add('first_step');

        return {
            ...config,
            gamification: {
                ...currentGami,
                points: newPoints,
                unlockedAchievementIds: Array.from(unlockedIds)
            }
        };
    },

    async getLeaderboard() {
        try {
            const usersRef = collection(db, 'users');
            // Query top 10 users by points
            const q = query(usersRef, orderBy('gamification.points', 'desc'), limit(10));
            const querySnapshot = await getDocs(q);

            const leaderboard = querySnapshot.docs.map((doc, index) => {
                const data = doc.data() as UserConfig;
                return {
                    rank: index + 1,
                    name: data.name || 'Anonymous',
                    points: data.gamification?.points || 0,
                    streak: data.gamification?.streak || 0,
                    class: data.classLevel ? String(data.classLevel) : 'N/A'
                };
            });

            return leaderboard;
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
            // Fallback to empty or mock if permission fails (e.g. rules not set yet)
            return [];
        }
    }
};
