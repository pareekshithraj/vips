
export interface Question {
    id: number;
    text: string;
    options: Option[];
    category: 'interest' | 'aptitude' | 'personality';
}

export interface Option {
    text: string;
    tags: Record<string, number>; // e.g., { 'analytical': 5, 'creative': 2 }
}

export interface CareerResult {
    title: string;
    description: string;
    fitScore: number; // 0-100
    tags: string[];
    paths: string[];
    outlook: string;
    salary: string;
    exams: string[];
}

export const STREAMS = {
    science_math: 'Science (PCM)',
    science_bio: 'Science (PCB)',
    commerce_math: 'Commerce with Math',
    commerce_gen: 'Commerce without Math',
    humanities: 'Humanities / Arts'
};

const CLASS_10_QUESTIONS: Question[] = [
    {
        id: 1,
        text: "When you encounter a complex problem, what is your first instinct?",
        category: 'aptitude',
        options: [
            { text: "Break it down into numbers and logic.", tags: { science_math: 5, commerce_math: 4 } },
            { text: "Research how it works in the real world.", tags: { science_bio: 5, humanities: 3 } },
            { text: "Think about who it affects and why.", tags: { humanities: 5, commerce_gen: 3 } },
            { text: "Look for a creative, out-of-the-box solution.", tags: { humanities: 4, science_math: 2 } }
        ]
    },
    {
        id: 2,
        text: "Which subject do you actually enjoy studying the most?",
        category: 'interest',
        options: [
            { text: "Mathematics & Physics - I love laws and formulas.", tags: { science_math: 5, commerce_math: 2 } },
            { text: "Biology - The human body and nature fascinate me.", tags: { science_bio: 5 } },
            { text: "History & Pol. Science - I like understanding society.", tags: { humanities: 5 } },
            { text: "Economics - Money and markets are interesting.", tags: { commerce_math: 5, commerce_gen: 5 } }
        ]
    },
    {
        id: 3,
        text: "Your dream workspace looks like:",
        category: 'personality',
        options: [
            { text: "A high-tech lab or a coding setup.", tags: { science_math: 4, science_bio: 4 } },
            { text: "A corporate office analyzing data and trends.", tags: { commerce_math: 5, commerce_gen: 4 } },
            { text: "A courtroom, design studio, or newsroom.", tags: { humanities: 5 } },
            { text: "A hospital or research facility.", tags: { science_bio: 5 } }
        ]
    },
    {
        id: 4,
        text: "How do you handle heavy reading and theory?",
        category: 'aptitude',
        options: [
            { text: "I prefer solving practical problems over reading.", tags: { science_math: 4 } },
            { text: "I can read for hours if it's a story or case study.", tags: { humanities: 5, commerce_gen: 3 } },
            { text: "I like reading facts, diagrams, and processes.", tags: { science_bio: 5, commerce_math: 3 } },
            { text: "I barely read; I prefer managing or doing things.", tags: { commerce_gen: 4 } }
        ]
    },
    {
        id: 5,
        text: "What kind of impact do you want to make?",
        category: 'personality',
        options: [
            { text: "Build new technology or infrastructure.", tags: { science_math: 5 } },
            { text: "Cure diseases or help people directly.", tags: { science_bio: 5, humanities: 2 } },
            { text: "Manage businesses and grow economies.", tags: { commerce_math: 5, commerce_gen: 5 } },
            { text: "Fight for justice, expression, or policy.", tags: { humanities: 5 } }
        ]
    }
];

const CLASS_12_SCIENCE_MATH_QUESTIONS: Question[] = [
    {
        id: 1,
        text: "Are you more interested in software/coding or physical machinery?",
        category: 'interest',
        options: [
            { text: "Coding, logic, and algorithms.", tags: { cs: 5, data: 4 } },
            { text: "Engines, structures, and robots.", tags: { mech: 5, civil: 4 } },
            { text: "Neither, I like pure physics/math theory.", tags: { research: 5 } },
            { text: "I prefer management roles in tech.", tags: { data: 2, mgmt: 5 } }
        ]
    },
    {
        id: 2,
        text: "How do you feel about long hours of deep focus?",
        category: 'personality',
        options: [
            { text: "I love getting lost in code/problems.", tags: { cs: 5, research: 4 } },
            { text: "I prefer moving around and field work.", tags: { civil: 5, mech: 3 } },
            { text: "I like fast-paced, changing environments.", tags: { mgmt: 5 } },
            { text: "I like detailed analysis of patterns.", tags: { data: 5 } }
        ]
    }
];

// ... (We can expand other streams similarly, keeping it concise for this valid prototype)

export const careerService = {
    getQuestions: (classLevel: number, stream?: string) => {
        if (classLevel === 10) return CLASS_10_QUESTIONS;
        // Simplified Logic for Class 12 Demo: Return Science Math questions as default or expand later
        // In a real app, we'd have a mapping.
        return CLASS_12_SCIENCE_MATH_QUESTIONS;
    },

    calculateRecommendation: (classLevel: number, answers: Record<number, number>) => {
        if (classLevel === 10) {
            const scores: Record<string, number> = {
                science_math: 0, science_bio: 0, commerce_math: 0, commerce_gen: 0, humanities: 0
            };

            CLASS_10_QUESTIONS.forEach(q => {
                const selectedOptionIndex = answers[q.id];
                if (selectedOptionIndex !== undefined) {
                    const tags = q.options[selectedOptionIndex].tags;
                    Object.entries(tags).forEach(([key, value]) => {
                        if (scores[key] !== undefined) scores[key] += value;
                    });
                }
            });

            const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
            return {
                recommended: sorted[0][0], // Returns a key like 'science_math'
                scores
            };
        } else {
            // Class 12 Logic - Recommend specific careers
            const scores: Record<string, number> = {
                cs: 0, mech: 0, civil: 0, data: 0, research: 0, mgmt: 0
            };

            // Note: In full version, we'd have different questions for each stream.
            // For now, using the Science-Math set as the distinct example
            CLASS_12_SCIENCE_MATH_QUESTIONS.forEach(q => {
                const selectedOptionIndex = answers[q.id];
                if (selectedOptionIndex !== undefined) {
                    const tags = q.options[selectedOptionIndex].tags;
                    Object.entries(tags).forEach(([key, value]) => {
                        if (scores[key] !== undefined) scores[key] += value;
                    });
                }
            });

            const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
            return {
                recommended: sorted[0][0], // Returns a key like 'cs', 'mech'
                scores
            };
        }
    },

    getResultDetails: (classLevel: number, key: string): CareerResult => {
        const STREAM_DETAILS: Record<string, CareerResult> = {
            science_math: {
                title: "Science (PCM)",
                description: "The gateway to Engineering, Technology, and Architecture. Ideal for students who love logic, numbers, and understanding how the physical world works.",
                fitScore: 95, // calculated dynamically in real app
                tags: ["Analytical", "Logical", "Technical"],
                paths: ["B.Tech/B.E (Computer Science, Mechanical, etc.)", "Architecture (B.Arch)", "Commercial Pilot", "Data Science", "Defence (NDA)"],
                outlook: "High demand in Tech & AI. Starting salaries vary widely but top tier is very high.",
                salary: "₹4L - ₹20L+ p.a.",
                exams: ["JEE Mains/Adv", "BITSAT", "NATA", "NDA"]
            },
            science_bio: {
                title: "Science (PCB)",
                description: "The path of Healers and Researchers. Perfect for those fascinated by life, biology, and medicine.",
                fitScore: 88,
                tags: ["Research", "Empathy", "Memory"],
                paths: ["MBBS (Doctor)", "BDS (Dentist)", "Biotechnology", "Psychology", "Pharmacy"],
                outlook: "Evergreen sector. Requires long study duration but offers high respect and stability.",
                salary: "₹5L - ₹15L+ p.a. (after specialization)",
                exams: ["NEET", "AIIMS Nursing", "CUET"]
            },
            commerce_math: {
                title: "Commerce with Math",
                description: "The powerhouse of Finance and Economics. For those who understand money, markets, and numbers.",
                fitScore: 92,
                tags: ["Calculative", "Strategic", "Financial"],
                paths: ["Chartered Accountancy (CA)", "Investment Banking", "Economics (Hons)", "Actuarial Science"],
                outlook: "High paying corporate roles. Very competitive exams.",
                salary: "₹6L - ₹25L+ p.a.",
                exams: ["CA Foundation", "IPMAT", "CUET", "ACET"]
            },
            commerce_gen: {
                title: "Commerce (General)",
                description: "Focus on Business, Management, and Entrepreneurship without the heavy load of advanced mathematics.",
                fitScore: 85,
                tags: ["Managerial", "Social", "Practical"],
                paths: ["BBA / MBA", "Digital Marketing", "Hotel Management", "Human Resources", "Entrepreneurship"],
                outlook: "Great for corporate climbers and business owners.",
                salary: "₹3L - ₹10L+ p.a.",
                exams: ["CUET", "IPMAT", "NCHMCT JEE"]
            },
            humanities: {
                title: "Humanities / Arts",
                description: "For the thinkers, creators, and changemakers. Covers Law, Policy, Design, and Social Sciences.",
                fitScore: 90,
                tags: ["Creative", "Expressive", "Critical"],
                paths: ["Law (BA LLB)", "Civil Services (UPSC)", "Journalism & Mass Comm", "Design (Fashion/Product)", "Psychology"],
                outlook: "Rising demand in creative and digital economies.",
                salary: "₹4L - ₹12L+ p.a.",
                exams: ["CLAT", "NIFT/NID", "UPSC (Post Grad)", "CUET"]
            }
        };

        const CAREER_DETAILS: Record<string, CareerResult> = {
            // Class 12 Outcomes
            cs: {
                title: "Computer Science Engineer",
                description: "The architect of the digital world. You love logic, code, and building systems that scale.",
                fitScore: 96,
                tags: ["Coding", "Logic", "Innovation"],
                paths: ["B.Tech CSE", "B.Sc Computer Science", "Data Engineering", "AI Specialist"],
                outlook: "Highest demand sector globally.",
                salary: "₹6L - ₹30L+ p.a.",
                exams: ["JEE Mains/Adv", "BITSAT", "VITEEE"]
            },
            mech: {
                title: "Mechanical/Robotics Engineer",
                description: "You love machines, motion, and physical structures. You want to build things that move.",
                fitScore: 92,
                tags: ["Machines", "Physics", "Design"],
                paths: ["B.Tech Mechanical", "Robotics Engg", "Mechatronics", "Automobile Engg"],
                outlook: "Strong demand in EV, Space, and Manufacturing.",
                salary: "₹5L - ₹18L+ p.a.",
                exams: ["JEE Mains", "GATE (Post grad)"]
            },
            data: {
                title: "Data Scientist / Analyst",
                description: "You see patterns where others see chaos. You love statistics, predictions, and insights.",
                fitScore: 94,
                tags: ["Stats", "Math", "Analysis"],
                paths: ["B.Stat (ISI)", "B.Tech AI/DS", "Economics"],
                outlook: "Fastest growing role in 2024.",
                salary: "₹8L - ₹25L+ p.a.",
                exams: ["ISI Entrance", "JEE"]
            },
            // ... (Add others) ...

            // Class 10 Outcomes (Streams)
        };

        if (classLevel === 10) {
            return STREAM_DETAILS[key] || STREAM_DETAILS['science_math'];
        } else if (classLevel === 12) {
            // Default to CS if key not found for Class 12
            return CAREER_DETAILS[key] || CAREER_DETAILS['cs'];
        }
        // Fallback for unexpected classLevel
        return STREAM_DETAILS['science_math'];
    }
};
