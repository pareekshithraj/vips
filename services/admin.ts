import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { UserConfig } from '../types';
import { differenceInCalendarDays } from 'date-fns';
import { PortalType, portalContextService } from './portalContext';

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
    schoolName: string;
    phone: string;
    careerPath?: string;
}



export const adminService = {
    /**
     * Get all students for the current portal
     * LMS: Fetches from 'users' collection (all students from all schools)
     * SCHOOL: Fetches from 'students' collection (school-specific students only)
     */
    async getAllStudents(portal: PortalType = 'school'): Promise<StudentSummary[]> {
        try {
            let querySnapshot;

            if (portal === 'lms') {
                console.log("Fetching LMS Students from 'users' collection");
                const usersRef = collection(db, 'users');
                querySnapshot = await getDocs(usersRef);
            } else {
                console.log("Fetching School Students from 'students' collection");
                const schoolId = portalContextService.getPortalContext('school').schoolId!;
                const studentsRef = collection(db, 'students');
                const q = query(studentsRef, where('schoolId', '==', schoolId));
                querySnapshot = await getDocs(q);
            }

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
                    email: data.email || doc.id,
                    schoolName: data.schoolName || 'N/A',
                    phone: data.phone || 'N/A',
                    careerPath: data.careerPath?.recommended
                };
            });
        } catch (error) {
            console.error("Error fetching students:", error);
            return [];
        }
    },

    async getStats(portal: PortalType = 'school') {
        const students = await this.getAllStudents(portal);
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
