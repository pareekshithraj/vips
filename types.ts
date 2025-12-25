
export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export type Checkpoint = 'Read' | 'Revised' | 'Practiced' | 'Thorough';

export interface Topic {
  id: string;
  name: string;
  estimatedHours: number;
}

export interface Chapter {
  id: string;
  name: string;
  difficulty: Difficulty;
  topics: Topic[];
}

export interface Subject {
  id: string;
  name: string;
  chapters: Chapter[];
  isCustom?: boolean;
  isManual?: boolean; // If true, allows adding chapters manually
}

export interface Syllabus {
  classLevel: number;
  subjects: Subject[];
}

export interface AvailableHours {
  weekday: number;
  hours: number;
}

export interface StudyTask {
  id: string;
  topicId: string;
  chapterId: string;
  chapterName: string;
  subjectName?: string;
  topicName: string;
  scheduledDate: string;
  duration: number;
  difficulty: Difficulty;
  isCompleted: boolean;
}

export interface ChapterProgress {
  difficulty: Difficulty;
  checkpoints: Checkpoint[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'PYQ' | 'Sample Paper' | 'Notes';
  year?: string;
  subjectId: string;
  link: string;
}

export interface DailyRoutine {
  wakeTime: string;      // "06:00"
  morningFreshUpTime: string;
  eveningFreshUpTime: string;
  bedTime: string;       // "22:00"
  breakfastTime: string; // "07:00"
  lunchTime: string;     // "13:00"
  snackTime: string;     // "17:00"
  dinnerTime: string;    // "20:00"
  schoolStartTime: string; // "08:00"
  schoolEndTime: string;   // "15:00"
  freeSlotBuffers: number; // minutes padding around events (e.g. 15)
}

export interface UserConfig {
  name: string;
  email: string;
  phone: string;
  schoolName: string;
  syllabusType: 'CBSE' | 'State';
  classLevel: 8 | 9 | 10 | 11 | 12;
  selectedSubjectIds: string[];
  customSubjects: Subject[];
  manualChapters: Record<string, Chapter[]>; // Key: subjectId, Value: Chapters
  examDate: string;
  availableHours: AvailableHours[];
  chapterProgress: Record<string, ChapterProgress>;
  completedTopicIds: string[];
  dailyRoutine?: DailyRoutine;
  onboarded: boolean;
  gamification: UserGamification;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji or Lucide icon name
  conditionType: 'streak' | 'task_count' | 'mastery' | 'early_bird' | 'night_owl';
  threshold: number;
}

export interface UserGamification {
  streak: number;
  lastStudyDate: string; // YYYY-MM-DD
  points: number;
  unlockedAchievementIds: string[];
}

