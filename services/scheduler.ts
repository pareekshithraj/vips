
import {
  StudyTask,
  UserConfig,
  Syllabus,
  Difficulty,
  Topic,
  Chapter
} from '../types';
import { addDays, format, isBefore, parseISO, getDay } from 'date-fns';

export const generateSchedule = (
  syllabus: Syllabus,
  config: UserConfig,
  startDate: string = format(new Date(), 'yyyy-MM-dd'),
  shuffle: boolean = false
): StudyTask[] => {
  const schedule: StudyTask[] = [];
  const { examDate, availableHours, chapterProgress } = config;

  // 1. Generate Chapter-Level Tasks
  let allCandidates: Array<{
    chapter: Chapter,
    subjectId: string,
    taskType: string,
    duration: number,
    priorityScore: number,
    userDifficulty: Difficulty
  }> = [];

  syllabus.subjects.forEach(subject => {
    // FILTER: Only schedule selected subjects
    if (!config.selectedSubjectIds.includes(subject.id)) return;

    subject.chapters.forEach(chapter => {
      const userProgress = chapterProgress[chapter.id];
      const currentDifficulty = userProgress?.difficulty || chapter.difficulty;
      const checkpoints = userProgress?.checkpoints || [];

      const hasRead = checkpoints.includes('Read');
      const hasRevised = checkpoints.includes('Revised');
      const hasPracticed = checkpoints.includes('Practiced');

      let requestedSessions: Array<{ type: string, hours: number }> = [];

      // PRIORITY LOGIC:
      // 1. Not Read -> READ (1 hour fixed)
      if (!hasRead) {
        requestedSessions = [{ type: 'Read & Understand', hours: 1.0 }];
      }
      // 2. Read but not Revised -> REVISE (Duration based on difficulty)
      else if (!hasRevised) {
        let hours = 0.67; // Default Medium: 40 mins
        if (currentDifficulty === Difficulty.EASY) hours = 0.42; // 25 mins
        if (currentDifficulty === Difficulty.HARD) hours = 1.25; // 1 hr 15 mins

        requestedSessions = [{ type: 'Revise & Recap', hours }];
      }
      // 3. Revised but not Practiced -> PRACTICE
      else if (!hasPracticed) {
        // Inferring durations for practice based on difficulty as well
        let hours = 0.75; // Medium: 45 mins
        if (currentDifficulty === Difficulty.EASY) hours = 0.5; // 30 mins
        if (currentDifficulty === Difficulty.HARD) hours = 1.0; // 60 mins
        requestedSessions = [{ type: 'Practice Problems', hours }];
      }
      // 4. Thorough -> Maintenance
      else {
        requestedSessions = [{ type: 'Quick Polish', hours: 0.33 }]; // 20 mins
      }

      const diffScore = { [Difficulty.HARD]: 30, [Difficulty.MEDIUM]: 20, [Difficulty.EASY]: 10 }[currentDifficulty];

      // PRIORITY BOOSTING (Updated Logic):
      // 1. Highest Priority: Consolidate what you just read (Read but not Revised). Score: 60
      // 2. High Priority: Learn new things (Not Read). Score: 40
      // 3. Medium Priority: Practice (Revised but not Practiced). Score: 30
      // 4. Low Priority: Polish (Thorough). Score: 10

      let stageScore = 0;
      if (!hasRead) stageScore = 40;
      else if (!hasRevised) stageScore = 60; // Boosted to ensure it appears after reading
      else if (!hasPracticed) stageScore = 30;
      else stageScore = 10;

      let priorityScore = diffScore + stageScore;

      // Add randomness if requested
      if (shuffle) {
        priorityScore += (Math.random() * 20) - 10;
      }

      requestedSessions.forEach((sess, idx) => {
        allCandidates.push({
          chapter,
          subjectId: subject.id,
          taskType: sess.type,
          duration: sess.hours,
          priorityScore: priorityScore - idx,
          userDifficulty: currentDifficulty
        });
      });
    });
  });

  allCandidates.sort((a, b) => b.priorityScore - a.priorityScore);

  let currentDate = parseISO(startDate);
  const examDateTime = parseISO(examDate);
  let remainingCandidates = [...allCandidates];

  while (remainingCandidates.length > 0 && isBefore(currentDate, examDateTime)) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const dayOfWeek = getDay(currentDate);
    const dailyTargetHours = availableHours.find(h => h.weekday === dayOfWeek)?.hours || 0;

    // Flexible Limits: Can go up to Target + 30 mins
    const maxDailyLimit = dailyTargetHours + 0.5;

    let hoursFilledToday = 0;
    const subjectsScheduledToday: Set<string> = new Set();

    // Continue trying to add tasks as long as we haven't exceeded the max limit
    // AND we haven't comfortably met the target (Target - 30 mins)
    // Actually, we should just try to fill up to the Target, but allow a task to *push* us up to MaxLimit.

    while (hoursFilledToday < dailyTargetHours) {
      if (remainingCandidates.length === 0) break;

      const timeLeftToMax = maxDailyLimit - hoursFilledToday;

      // Find best candidate that fits within the absolute max limit
      let bestCandidateIndex = -1;
      let highestLoopScore = -Infinity;

      for (let i = 0; i < remainingCandidates.length; i++) {
        const cand = remainingCandidates[i];

        // Check if this task fits within the remaining flexible buffer
        if (cand.duration <= timeLeftToMax) {
          let loopScore = cand.priorityScore;
          if (!subjectsScheduledToday.has(cand.subjectId)) {
            loopScore += 15; // Variety Boost
          }
          if (loopScore > highestLoopScore) {
            highestLoopScore = loopScore;
            bestCandidateIndex = i;
          }
        }
      }

      if (bestCandidateIndex !== -1) {
        const selected = remainingCandidates[bestCandidateIndex];

        const uniqueTopicId = `${selected.chapter.id}-${selected.taskType}`;

        schedule.push({
          id: `task-${selected.chapter.id}-${dateStr}-${hoursFilledToday.toFixed(2)}`,
          topicId: uniqueTopicId,
          chapterId: selected.chapter.id,
          chapterName: selected.chapter.name,
          subjectName: syllabus.subjects.find(s => s.id === selected.subjectId)?.name,
          topicName: selected.taskType,
          scheduledDate: dateStr,
          duration: Number(selected.duration.toFixed(2)),
          difficulty: selected.userDifficulty,
          isCompleted: config.completedTopicIds.includes(uniqueTopicId)
        });

        hoursFilledToday += selected.duration;
        subjectsScheduledToday.add(selected.subjectId);
        remainingCandidates.splice(bestCandidateIndex, 1);

      } else {
        // No task fits the remaining time space
        break;
      }
    }

    currentDate = addDays(currentDate, 1);
  }

  return schedule;
};

export const reshuffleSchedule = (
  syllabus: Syllabus,
  config: UserConfig
): StudyTask[] => {
  const today = format(new Date(), 'yyyy-MM-dd');
  return generateSchedule(syllabus, config, today);
};
