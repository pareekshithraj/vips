# Vidyabodhini Integrated Public School - LMS

A comprehensive Learning Management System (LMS) and dynamic timetable generator for students.

## Features
- **Dynamic Timetable**: Auto-generates study schedules based on school hours and daily routine.
- **Syllabus Tracking**: Tracks progress for CBSE/State board subjects (Class 8-12).
- **Study Desk**: Integrated focus timer, resources, and insights.
- **Authentication**: Student login/registration with Firebase.

## Setup & Run Locally

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   - Create a `.env.local` file in the root directory.
   - Add your Gemini API key:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Deployment
This project is ready for deployment on **Vercel**, **Netlify**, or **Firebase Hosting**.
- Ensure you add the `GEMINI_API_KEY` to your deployment platform's environment variables.

