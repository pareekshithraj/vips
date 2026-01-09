import { UserConfig } from '../types';
import { DEFAULT_WEEKLY_HOURS } from '../constants';

export const migrationService = {
    /**
     * Ensures the user object has all required fields, filling defaults for missing new fields.
     * This runs on every session load to "migrate" the schema on the fly.
     */
    migrateUserSchema(data: any): UserConfig {
        // Base defaults for a clean user
        const defaults: UserConfig = {
            name: '',
            email: '',
            schoolName: '',
            phone: '',
            classLevel: 10,
            syllabusType: 'CBSE',
            selectedSubjectIds: [],
            customSubjects: [],
            manualChapters: {},
            examDate: new Date().toISOString(), // Will be parsed/formatted by App if needed
            availableHours: DEFAULT_WEEKLY_HOURS,
            chapterProgress: {},
            completedTopicIds: [],
            onboarded: false,
            // New Fields Defaults
            gamification: {
                streak: 0,
                lastStudyDate: '',
                points: 0,
                unlockedAchievementIds: []
            },
            careerPath: undefined
        };

        // Merge defaults with existing data
        // We use careful merging to ensure nested objects like 'gamification' exist
        const merged: UserConfig = {
            ...defaults,
            ...data,
            gamification: {
                ...defaults.gamification!,
                ...(data.gamification || {})
            }
        };

        return merged;
    }
};
