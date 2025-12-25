import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { UserConfig } from '../types';
import { differenceInCalendarDays } from 'date-fns';

export interface StudentSummary {
    id: string;
    name: string;
    class: string;
    section: string;
    syllabus: 'CBSE' | 'State';
    progress: number;
    lastActive: string;
    status: 'Active' | 'Inactive';
    email: string;
}

const MOCK_STUDENTS: StudentSummary[] = [
    { id: '1', name: 'Aarav Sharma', class: '10', section: 'A', syllabus: 'CBSE', progress: 85, lastActive: 'Today', status: 'Active', email: 'aarav@example.com' },
    { id: '2', name: 'Priya P.', class: '10', section: 'B', syllabus: 'CBSE', progress: 72, lastActive: 'Today', status: 'Active', email: 'priya@example.com' },
    { id: '3', name: 'Vikram Singh', class: '12', section: 'A', syllabus: 'CBSE', progress: 45, lastActive: 'Yesterday', status: 'Active', email: 'vikram@example.com' },
    { id: '4', name: 'Sneha K.', class: '9', section: 'C', syllabus: 'State', progress: 91, lastActive: 'Today', status: 'Active', email: 'sneha@example.com' },
    { id: '5', name: 'Rahul V.', class: '10', section: 'A', syllabus: 'CBSE', progress: 60, lastActive: '2 days ago', status: 'Active', email: 'rahul@example.com' },
    { id: '6', name: 'Ananya Gupta', class: '11', section: 'B', syllabus: 'CBSE', progress: 30, lastActive: '1 week ago', status: 'Inactive', email: 'ananya@example.com' },
    { id: '7', name: 'Rohan Mehta', class: '12', section: 'Science', syllabus: 'CBSE', progress: 55, lastActive: 'Today', status: 'Active', email: 'rohan@example.com' },
    { id: '8', name: 'Ishaan Kumar', class: '8', section: 'A', syllabus: 'State', progress: 20, lastActive: '3 days ago', status: 'Active', email: 'ishaan@example.com' },
    { id: '9', name: 'Mira Nair', class: '10', section: 'B', syllabus: 'CBSE', progress: 78, lastActive: 'Today', status: 'Active', email: 'mira@example.com' },
    { id: '10', name: 'Kabir Das', class: '11', section: 'Commerce', syllabus: 'CBSE', progress: 40, lastActive: 'Yesterday', status: 'Active', email: 'kabir@example.com' }
];

export const adminService = {
    async getAllStudents(): Promise<StudentSummary[]> {
        try {
            const usersRef = collection(db, 'users');
            const querySnapshot = await getDocs(usersRef);

            return querySnapshot.docs.map(doc => {
                const data = doc.data() as UserConfig;
                const lastStudyDate = data.gamification?.lastStudyDate;
                let status: 'Active' | 'Inactive' = 'Inactive';
                let lastActive = 'Never';

                if (lastStudyDate) {
                    const diff = differenceInCalendarDays(new Date(), new Date(lastStudyDate));
                    if (diff === 0) {
                        status = 'Active';
                        lastActive = 'Today';
                    } else if (diff === 1) {
                        status = 'Active';
                        lastActive = 'Yesterday';
                    } else {
                        lastActive = `${diff} days ago`;
                        if (diff < 7) status = 'Active';
                    }
                }

                // Calculate progress roughly from mastery score logic or completed items
                // For now, let's assume points roughly correlate or use completed items count
                const progress = Math.min(100, Math.floor((data.completedTopicIds?.length || 0) * 2));

                return {
                    id: doc.id, // Email is the doc ID in our schema
                    name: data.name || 'Unknown',
                    class: data.classLevel ? String(data.classLevel) : '-',
                    section: 'A', // Not stored in UserConfig yet
                    syllabus: (data.syllabusType as 'CBSE' | 'State') || 'CBSE',
                    progress: progress,
                    lastActive: lastActive,
                    status: status,
                    email: data.email || doc.id
                };
            });
        } catch (error) {
            console.error("Error fetching students:", error);
            return [];
        }
    },

    async getStats() {
        const students = await this.getAllStudents();
        const totalStudents = students.length;
        const activeToday = students.filter(s => s.lastActive === 'Today').length;
        const avgProgress = totalStudents > 0
            ? Math.floor(students.reduce((acc, curr) => acc + curr.progress, 0) / totalStudents)
            : 0;

        const classDist: Record<string, number> = {};
        students.forEach(s => {
            classDist[s.class] = (classDist[s.class] || 0) + 1;
        });

        return {
            totalStudents,
            activeToday,
            averageProgress: avgProgress,
            classDistribution: classDist
        };
    }
};
