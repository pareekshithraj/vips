# Software Development Life Cycle (SDLC) Document
**Project Name**: Vidyabodhini (Vidyabodhini Integrated Public School)
**Repository Name**: `cbse-study-pro:-dynamic-timetable-ai`
**Version**: 1.0.0
**Date**: December 25, 2025

---

## 1. Requirement Analysis
**Objective**: To build an intelligent study management platform for high school students (specifically CBSE and State Boards) that automates timetable creation, tracks progress, and gamifies the learning experience.

### Key Functional Requirements
- **Dynamic Scheduling**: Automatically generate study schedules based on student's available hours and syllabus.
- **Syllabus Management**: Support for multiple syllabi (CBSE, State) and diverse subjects (Math, Science, Social, Languages).
- **Gamification**: implementation of logic to track daily streaks and a leaderboard to foster healthy competition.
- **Admin Portal**: A restricted area for school administrators to monitor student statistics and engagement.
- **User Authentication**: Secure login/registration via Firebase (Email/Password, Google).

### Non-Functional Requirements
- **Performance**: Fast load times (<2s) for dashboard components.
- **Scalability**: Ability to handle growing user data in Firestore.
- **Responsiveness**: Fully responsive UI working across Desktops and Mobile devices.

---

## 2. System Design

### Architecture
- **Frontend**: Single Page Application (SPA) built with **React** and **Vite**.
- **Backend / Database**: Serverless architecture using **Firebase** (Auth for identity, Firestore for NoSQL data storage).
- **Styling**: **Tailwind CSS** for utility-first, responsive design.

### Data Model (Firestore)
- **`users` Collection**: Stores user profile, syllabus completion status, and gamification stats.
    - Fields: `name`, `email`, `schoolName`, `classLevel`, `syllabusType`, `gamification` (streak, points).
- **Gamification Structure**:
    - `streak`: Integer (consecutive days studied).
    - `points`: Integer (based on task completion).
    - `unlockedAchievementIds`: Array of strings.

### Component Structure
- **Core**: `App.tsx` (Router & State), `DashboardLayout` (Shell).
- **Features**: `TimetableView` (Scheduler UI), `Leaderboard` (Gamification), `AdminDashboard` (School Mgmt).

---

## 3. Implementation

### Technology Stack
- **Language**: TypeScript (for type safety and maintainability).
- **Framework**: React 18.
- **Build Tool**: Vite.
- **Icons**: Lucide-React.
- **Date Handling**: date-fns.

### Key Modules Developed
1.  **Scheduler Service (`scheduler.ts`)**:
    - Algorithms to distribute study topics across available weekly slots.
    - Prioritizes incomplete chapters and hard subjects.
2.  **Gamification Service (`gamification.ts`)**:
    - `checkStreak()`: Runs on login to validate and update daily streaks.
    - `getLeaderboard()`: Fetches top users from Firestore, sorting by points.
3.  **Admin Service (`admin.ts`)**:
    - Aggregates data from the `users` collection to provide real-time stats (Active Today, Class Distribution).

---

## 4. Testing & Verification

### Testing Strategy
- **Unit Testing**: Verified logic for streak calculation and scheduler distribution.
- **Integration Testing**: Verified flow from `Auth` -> `Onboarding` -> `Dashboard`.
- **UI/UX Testing**: Checked responsiveness of the Landing Page and consistency of the "Premium" aesthetic.

### Verification Results
- **Gamification**: Confirmed streak updates correctly on daily login. Leaderboard accurately reflects the top 10 ranked users.
- **Admin Portal**: Confirmed restricted access flow; stats card calculations match database records.
- **Data Integrity**: Verified that legacy users (pre-gamification) are auto-migrated upon login without crashing.

---

## 5. Deployment

### Strategy
- **Platform**: Vercel / Netlify (Recommended for Vite SPAs).
- **Configuration**:
    - Build Command: `npm run build`
    - Output Directory: `dist`
- **Environment Variables**:
    - `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, etc. (Secured in CI/CD secrets).

---

## 6. Maintenance & Future Scope

### Maintenance Plan
- Regular monitoring of Firestore read/write usage.
- Periodic updates to the `SYLLABUS_DATA` constant as school curriculums change.

### Future Enhancements
- **AI Tutoring**: Integrate LLMs to generate quiz questions for specific chapters.
- **Social Features**: Allow students to add friends and challenge them.
- **Mobile App**: Wrap the React app into a native container (Capacitor/React Native).
