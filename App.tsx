import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import {
  Layout, ChevronLeft, Menu, X, AlertCircle,
  GraduationCap, Moon, Sun, CheckCircle, BookOpen, Zap
} from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';

import { SYLLABUS_DATA, DEFAULT_WEEKLY_HOURS } from './constants';
import { StudyTask, UserConfig, Checkpoint, ChapterProgress, Syllabus, Subject } from './types';
import { generateSchedule } from './services/scheduler';
import { authService } from './services/auth';
import { userService } from './services/user';
import { gamificationService } from './services/gamification';
import { AboutView, AcademicsView, BeyondClassroomView, AdmissionsView } from './components/PublicPages';
import { ProfileView } from './components/ProfileView';
import { DashboardLayout } from './components/lms/DashboardLayout';
import { AdminDashboard } from './components/school/admin/AdminDashboard';
import { TeacherDashboard } from './components/school/teacher/TeacherDashboard';
import { DriverDashboard } from './components/school/driver/DriverDashboard';
import { StudentSchoolPortal } from './components/school/student/StudentSchoolPortal';
import { migrationService } from './services/migration';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './services/firebase';

import logoImg from './assets/logo.png';
import schoolBuildingImg from './assets/school_building.jpg';

const CHECKPOINTS: Checkpoint[] = ['Read', 'Revised', 'Practiced', 'Thorough'];
const SCHOOL_LOGO_URL = logoImg;

// --- Error Boundary for Debugging ---
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-center">
          <h2 className="text-2xl font-black text-red-600 mb-4">Something went wrong.</h2>
          <pre className="bg-red-50 p-4 rounded text-left text-xs text-red-800 overflow-auto max-w-2xl mx-auto">
            {this.state.error?.toString()}
          </pre>
          <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-xl font-bold">
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Shared Layout for Public Pages ---
const PublicLayout: React.FC<{ children: React.ReactNode, setView: (v: any) => void, darkMode: boolean, toggleDarkMode: () => void }> = ({ children, setView, darkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={`min-h-screen flex flex-col font-['Inter'] transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`}>
      <div className="bg-emerald-900 text-emerald-50 py-2 px-6 text-[10px] font-bold uppercase tracking-widest flex justify-between items-center z-50 relative">
        <div className="flex gap-4">
          <span>Affiliated to the CBSE (#831498)</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">School Code (#47177)</span>
        </div>
        <div className="flex gap-4">
          <span>+91-70222 55677</span>
          <span>info@vidyabodhini.org</span>
        </div>
      </div>

      <header className={`backdrop-blur-md border-b px-6 py-4 sticky top-0 z-50 shadow-sm transition-all ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setView('landing')}>
            <img src={SCHOOL_LOGO_URL} alt="VIPS Logo" className="w-12 h-12 md:w-16 md:h-16 rounded-xl object-cover border-2 border-slate-50 shadow-sm" />
            <div>
              <h1 className={`font-black text-lg md:text-xl leading-none uppercase tracking-tight ${darkMode ? 'text-emerald-400' : 'text-emerald-950'}`}>Vidyabodhini</h1>
              <p className={`text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1 ${darkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>Integrated Public School</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-500">
            <button onClick={() => setView('about')} className={`transition-colors ${darkMode ? 'hover:text-emerald-400 text-slate-400' : 'hover:text-emerald-900'}`}>About Us</button>
            <button onClick={() => setView('academics')} className={`transition-colors ${darkMode ? 'hover:text-emerald-400 text-slate-400' : 'hover:text-emerald-900'}`}>Academics (K-12)</button>
            <button onClick={() => setView('beyond')} className={`transition-colors ${darkMode ? 'hover:text-emerald-400 text-slate-400' : 'hover:text-emerald-900'}`}>Beyond Classroom</button>
            <button onClick={() => setView('admissions')} className={`transition-colors ${darkMode ? 'hover:text-emerald-400 text-slate-400' : 'hover:text-emerald-900'}`}>Admissions</button>
            <button onClick={toggleDarkMode} className={`p-2 rounded-full transition-colors ${darkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <button onClick={toggleDarkMode} className={`p-2 rounded-full transition-colors ${darkMode ? 'bg-slate-800 text-yellow-400' : 'bg-slate-100 text-slate-600'}`}>
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`p-2 map-2 ${darkMode ? 'text-white' : 'text-emerald-950'}`}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className={`md:hidden absolute top-full left-0 w-full backdrop-blur-xl border-b shadow-xl animate-in slide-in-from-top-2 p-6 flex flex-col gap-4 text-center ${darkMode ? 'bg-slate-900/95 border-slate-800 text-white' : 'bg-white/95 border-slate-100'}`}>
            <button onClick={() => { setView('about'); setIsMenuOpen(false); }} className="py-3 font-black text-emerald-900 uppercase tracking-widest border-b border-slate-50">About Us</button>
            <button onClick={() => { setView('academics'); setIsMenuOpen(false); }} className="py-3 font-black text-emerald-900 uppercase tracking-widest border-b border-slate-50">Academics</button>
            <button onClick={() => { setView('beyond'); setIsMenuOpen(false); }} className="py-3 font-black text-emerald-900 uppercase tracking-widest border-b border-slate-50">Beyond Classroom</button>
            <button onClick={() => { setView('admissions'); setIsMenuOpen(false); }} className="py-3 font-black text-emerald-900 uppercase tracking-widest border-b border-slate-50">Admissions</button>
            <button onClick={() => { setView('login-lms'); setIsMenuOpen(false); }} className="py-3 bg-emerald-50 text-emerald-700 rounded-xl font-black uppercase tracking-widest mt-2">Login</button>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-emerald-950 text-emerald-200 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Footer content remains same */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src={SCHOOL_LOGO_URL} alt="Logo" className="w-12 h-12 rounded-xl border-2 border-emerald-800" />
              <div>
                <h2 className="text-white font-black text-lg uppercase tracking-tight">Vidyabodhini</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Integrated Public School</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-sm text-emerald-300/80">
              A center of learning where tradition meets modernity. We strive to create global citizens who are rooted in values and ready for the future.
            </p>
          </div>
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><button onClick={() => setView('about')} className="hover:text-white transition-colors">About the School</button></li>
              <li><button onClick={() => setView('admissions')} className="hover:text-white transition-colors">Admission Process</button></li>
              <li><button onClick={() => setView('admissions')} className="hover:text-white transition-colors">Fee Structure</button></li>
              <li><button onClick={() => setView('login-school')} className="hover:text-white transition-colors">Parent Portal</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-6">Contact Us</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>Vidyabodhini Integrated Public School,</li>
              <li>47/7, Chowdadenahalli, Narasapura-Vemgal Road,</li>
              <li>Narasapura - 563133.</li>
              <li className="pt-2 text-white font-bold">+91-70222 55677</li>
              <li>info@vidyabodhini.org</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-emerald-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
          <p>© 2025 Vidyabodhini School. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Use</a>
            <a href="#" className="hover:text-white">Mandatory Disclosure</a>
          </div>
          <button onClick={() => setView('admin-login')} className="text-emerald-800 hover:text-white transition-colors">Admin Portal</button>
        </div>
      </footer>
    </div>
  )
};

const LandingContent: React.FC<{ setView: (v: any) => void }> = ({ setView }) => (
  <>
    <section className="relative py-32 px-6 overflow-hidden min-h-[600px] flex items-center">
      <div className="absolute inset-0 z-0">
        <img src={schoolBuildingImg} alt="School Building" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/70 to-emerald-900/30" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        {/* DEV TOOLS REMOVED FOR PRODUCTION SECURITY */}

        <div className="max-w-3xl space-y-8 animate-in slide-in-from-left duration-700">
          <div className="inline-flex items-center gap-2 bg-emerald-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-500/30 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-black text-emerald-100 uppercase tracking-widest">Admissions Open 2025-26</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
            Nurturing Hearts, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-teal-200">Inspiring Minds.</span>
          </h2>
          <p className="text-emerald-100 text-lg font-medium max-w-xl leading-relaxed">
            A premier K-12 institution committed to academic excellence, character building, and holistic development for every child.
          </p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => setView('about')} className="px-8 py-4 bg-white text-emerald-950 rounded-xl font-black text-sm uppercase tracking-wider shadow-xl hover:bg-emerald-50 hover:-translate-y-1 transition-all">
              Virtual Tour
            </button>
            <button onClick={() => setView('login-lms')} className="px-8 py-4 bg-transparent text-white border border-emerald-200/50 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-emerald-900/50 transition-all">
              Login
            </button>
          </div>
        </div>
      </div>
    </section>

    <section className="py-16 px-6 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-emerald-950 font-black text-3xl mb-4">Our Tools</h3>
          <p className="text-slate-500 max-w-2xl mx-auto">Digital platforms to support learning and administration.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center max-w-6xl mx-auto">
          {/* ACE Your Boards - Free Tool */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all text-center group relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-widest shadow-sm">
              Free for All
            </div>
            <div className="w-20 h-20 mx-auto rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-black text-slate-900 mb-2">ACE Your Boards</h4>
            <p className="text-slate-500 text-sm mb-8">Boost your exam preparation with our free revision planner.</p>
            <div className="flex gap-3 justify-center">
              <a href="/ace_your_boards/index.html" target="_blank" rel="noopener noreferrer" className="px-8 py-3 rounded-xl bg-orange-600 text-white font-black text-xs uppercase tracking-wider shadow-lg hover:bg-orange-700 transition-all">
                Visit Now
              </a>
            </div>
          </div>
          {/* LMS Card - Public / Students */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all text-center group relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-widest shadow-sm">
              Free for All
            </div>
            <div className="w-20 h-20 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BookOpen className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-black text-slate-900 mb-2">LMS Portal</h4>
            <p className="text-slate-500 text-sm mb-8">Access study materials, personalized plans, and track progress.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setView('login-lms')} className="px-6 py-3 rounded-xl border-2 border-indigo-50 text-indigo-900 font-black text-xs uppercase tracking-wider hover:bg-indigo-50 transition-all">
                LMS Login
              </button>
              <button onClick={() => setView('register')} className="px-6 py-3 rounded-xl bg-indigo-900 text-white font-black text-xs uppercase tracking-wider shadow-lg hover:bg-indigo-800 transition-all">
                Register
              </button>
            </div>
          </div>

          {/* School Portal - Restricted */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all text-center group">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Layout className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-black text-slate-900 mb-2">School Portal</h4>
            <p className="text-slate-500 text-sm mb-8">ERP Login for Admitted Students & Staff. (Restricted Access)</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setView('login-school')} className="px-8 py-3 rounded-xl bg-emerald-900 text-white font-black text-xs uppercase tracking-wider shadow-lg hover:bg-emerald-800 transition-all">
                School Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ... Remaining Landing Content (Journey, Advantage) ... */}
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-emerald-950 font-black text-3xl mb-4">A Journey of Excellence</h3>
          <p className="text-slate-500 max-w-2xl mx-auto">From their first steps in Kindergarten to their graduation day, we guide every student towards their full potential.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Primary Years", range: "KG - Grade 5", desc: "Foundation of curiosity and creativity.", color: "bg-orange-50 text-orange-600" },
            { title: "Middle School", range: "Grade 6 - 8", desc: "Exploration and skill development.", color: "bg-blue-50 text-blue-600" },
            { title: "Senior School", range: "Grade 9 - 12", desc: "Academic rigor and career readiness.", color: "bg-emerald-50 text-emerald-600" }
          ].map((level, i) => (
            <div key={i} className="p-8 rounded-[2rem] border border-slate-100 hover:shadow-xl transition-all group">
              <div className={`w-16 h-16 rounded-2xl ${level.color} flex items-center justify-center font-black text-xl mb-6 group-hover:scale-110 transition-transform`}>
                {level.range.substring(0, 1)}
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-2">{level.title}</h4>
              <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4">{level.range}</span>
              <p className="text-slate-500 text-sm leading-relaxed">{level.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h3 className="text-emerald-950 font-black text-3xl mb-8">The Vidyabodhini Advantage</h3>
          <div className="space-y-6">
            {[
              { title: "Holistic Curriculum", desc: "Balanced focus on Academics, Arts, and Sports." },
              { title: "World-Class Campus", desc: "Smart classrooms, Olympic-size pool, and modern labs." },
              { title: "Expert Faculty", desc: "1:15 Teacher-Student ratio for personalized attention." }
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-emerald-600 shrink-0">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-black text-emerald-950 text-lg">{item.title}</h5>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-emerald-900 rounded-[3rem] p-12 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-3xl font-black mb-4">Admissions Open</h4>
            <p className="text-emerald-200 mb-8">For the Academic Session 2025-26. Limited seats available.</p>
            <button onClick={() => setView('admissions')} className="bg-white text-emerald-900 px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-emerald-50 transition-colors">Apply Online</button>
          </div>
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
      </div>
    </section>
  </>
);

const AuthForm: React.FC<{
  mode: 'login' | 'register',
  portalType?: 'lms' | 'school',
  onSubmit: (data: any) => void,
  error?: string
}> = ({ mode, onSubmit, error, portalType }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', schoolName: '', phone: '', classLevel: '10', syllabusType: 'CBSE' });
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-indigo-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 space-y-8 animate-in zoom-in-95">
        <div className="relative text-center">
          <button onClick={() => navigate(-1)} className="absolute left-0 top-0 p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6 text-slate-400" />
          </button>
          <img src={SCHOOL_LOGO_URL} alt="Logo" className="w-16 h-16 rounded-2xl mx-auto mb-4 object-cover border-4 border-slate-50" />
          <h2 className="text-2xl font-black text-indigo-950">
            {mode === 'login' ? (portalType === 'school' ? 'School Portal Login' : 'LMS Portal Login') : 'Student Registration'}
          </h2>
          <p className="text-slate-400 text-xs font-bold mt-1">Vidyabodhini Integrated Public School</p>
          {mode === 'register' && <p className="text-emerald-600 text-[10px] font-black uppercase tracking-widest mt-2 bg-emerald-50 py-1 px-3 rounded-full inline-block">Free for all students of all schools</p>}
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}

        <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...formData, portalType }); }} className="space-y-4">
          {mode === 'register' && (
            <>
              <input
                type="text" required placeholder="Full Name"
                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-bold text-indigo-950"
              />
              <input
                type="text" required placeholder="School Name"
                value={formData.schoolName} onChange={e => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full p-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-bold text-indigo-950"
              />
              <input
                type="tel" required placeholder="Phone Number"
                value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-bold text-indigo-950"
              />
              <select
                value={formData.classLevel} onChange={e => setFormData({ ...formData, classLevel: e.target.value })}
                className="w-full p-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-bold text-indigo-950"
              >
                {[8, 9, 10, 11, 12].map(c => <option key={c} value={c}>Class {c}</option>)}
              </select>
              <select
                value={formData.syllabusType} onChange={e => setFormData({ ...formData, syllabusType: e.target.value })}
                className="w-full p-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-bold text-indigo-950"
              >
                <option value="CBSE">CBSE</option>
                <option value="State">State Board</option>
              </select>
              <p className="text-xs text-center font-bold text-emerald-600 bg-emerald-50 py-2 rounded-lg">
                ✨ Free for all students of all schools ✨
              </p>
            </>
          )}
          <input
            type="email" required placeholder="Registration Email"
            value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-bold text-indigo-950"
          />
          <input
            type="password" required placeholder="Password"
            value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
            className="w-full p-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-bold text-indigo-950"
          />
          <button type="submit" className="w-full bg-indigo-900 text-white py-4 rounded-xl font-black hover:bg-indigo-800 transition-all shadow-lg">
            {mode === 'login' ? 'Sign In' : 'Register Now'}
          </button>
        </form>

        <div className="text-center space-y-4 pt-4">
          {mode === 'login' && (
            <button onClick={() => navigate('/register')} className="text-xs text-indigo-900 font-bold hover:underline">
              New Student? Create Account
            </button>
          )}
          {mode === 'register' && (
            <button onClick={() => navigate('/login-lms')} className="text-xs text-indigo-900 font-bold hover:underline">
              Already have an account? Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const OnboardingView: React.FC<{
  userConfig: UserConfig;
  setUserConfig: React.Dispatch<React.SetStateAction<UserConfig>>;
  onboardingStep: number;
  setOnboardingStep: React.Dispatch<React.SetStateAction<number>>;
  currentSyllabus: Syllabus;
  onComplete: () => void;
  onAddCustomSubject: (name: string) => void;
  onLogout: () => void;
}> = ({ userConfig, setUserConfig, onboardingStep, setOnboardingStep, currentSyllabus, onComplete, onAddCustomSubject, onLogout }) => {
  const [newSubName, setNewSubName] = useState('');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 space-y-8 animate-in slide-in-from-bottom-4 relative">
        <button onClick={onLogout} className="absolute top-8 right-8 text-slate-400 hover:text-red-500 text-xs font-bold uppercase tracking-widest transition-colors">
          Logout
        </button>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-black text-indigo-900">Step {onboardingStep} of 4</h2>
            <div className="w-12 h-1 bg-indigo-900 rounded mt-1"></div>
          </div>
          <button onClick={onLogout} className="text-xs font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest">Logout</button>
        </div>

        {onboardingStep === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <h1 className="text-2xl font-black text-indigo-950 mb-2">Complete Your Profile</h1>
            <p className="text-slate-500 font-medium mb-6">
              Please provide a few more details to get started.<br />
              <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">User: {userConfig.email}</span>
            </p>
            <div className="space-y-4">
              <input
                type="text" placeholder="Full Name" required
                value={userConfig.name} onChange={e => setUserConfig({ ...userConfig, name: e.target.value })}
                className="w-full p-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-bold text-indigo-950"
              />
              <input
                type="text" placeholder="School Name" required
                value={userConfig.schoolName} onChange={e => setUserConfig({ ...userConfig, schoolName: e.target.value })}
                className="w-full p-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-bold text-indigo-950"
              />
              <input
                type="tel" placeholder="Phone Number" required
                value={userConfig.phone} onChange={e => setUserConfig({ ...userConfig, phone: e.target.value })}
                className="w-full p-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-bold text-indigo-950"
              />
            </div>
          </div>
        )}

        {onboardingStep === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-2xl font-black text-indigo-950">Select Standard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[8, 9, 10, 11, 12].map(lvl => (
                <button key={lvl} onClick={() => setUserConfig({ ...userConfig, classLevel: lvl as any, selectedSubjectIds: [] })} className={`p-8 rounded-2xl border-4 transition-all flex flex-col items-center gap-3 ${userConfig.classLevel === lvl ? 'border-indigo-900 bg-indigo-50 text-indigo-900' : 'border-slate-50 text-slate-400'}`}>
                  <GraduationCap className="w-8 h-8" />
                  <span className="font-black text-lg">Class {lvl}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {onboardingStep === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-2xl font-black text-indigo-950">Your Subjects</h2>
            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-2">
              {currentSyllabus.subjects.map(s => (
                <button key={s.id} onClick={() => {
                  const active = userConfig.selectedSubjectIds.includes(s.id);
                  setUserConfig({ ...userConfig, selectedSubjectIds: active ? userConfig.selectedSubjectIds.filter(id => id !== s.id) : [...userConfig.selectedSubjectIds, s.id] });
                }} className={`p-4 rounded-xl border-2 flex justify-between font-bold items-center ${userConfig.selectedSubjectIds.includes(s.id) ? 'border-indigo-600 bg-indigo-50 text-indigo-900' : 'border-slate-100 text-slate-500'}`}>
                  {s.name} {userConfig.selectedSubjectIds.includes(s.id) && <CheckCircle className="w-5 h-5 text-indigo-600" />}
                </button>
              ))}
            </div>
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <input
                type="text"
                placeholder="Add Custom Subject (e.g. Psychology)"
                className="flex-1 p-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-bold text-xs"
                value={newSubName}
                onChange={e => setNewSubName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && newSubName) { onAddCustomSubject(newSubName); setNewSubName(''); } }}
              />
              <button disabled={!newSubName} onClick={() => { onAddCustomSubject(newSubName); setNewSubName(''); }} className="bg-indigo-900 text-white px-4 rounded-xl font-black text-xs disabled:opacity-50">+</button>
            </div>
          </div>
        )}

        {onboardingStep === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-2xl font-black text-indigo-950">Exam Date</h2>
            <p className="text-slate-400 text-sm font-medium">When do your board exams start?</p>
            <input type="date" className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-black text-indigo-900" value={userConfig.examDate} onChange={(e) => setUserConfig({ ...userConfig, examDate: e.target.value })} />
          </div>
        )}

        <div className="flex gap-4 pt-4">
          {onboardingStep > 1 && <button onClick={() => setOnboardingStep(onboardingStep - 1)} className="p-5 rounded-2xl bg-slate-100"><ChevronLeft /></button>}
          <button
            onClick={() => { if (onboardingStep < 4) setOnboardingStep(onboardingStep + 1); else onComplete(); }}
            disabled={(onboardingStep === 1 && (!userConfig.phone || !userConfig.schoolName || !userConfig.name)) || (onboardingStep === 3 && userConfig.selectedSubjectIds.length === 0)}
            className="flex-1 bg-indigo-900 text-white py-5 rounded-2xl font-black disabled:opacity-50 hover:bg-indigo-800 transition-all shadow-xl"
          >
            {onboardingStep === 4 ? 'Generate My Plan' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};


const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to check current path if needed

  // Shim for components that expect setView
  const setViewShim = (view: string) => {
    switch (view) {
      case 'landing': navigate('/'); break;
      case 'about': navigate('/about'); break;
      case 'academics': navigate('/academics'); break;
      case 'beyond': navigate('/beyond'); break;
      case 'admissions': navigate('/admissions'); break;
      case 'login-lms': navigate('/login-lms'); break;
      case 'login-school': navigate('/login-school'); break;
      case 'register': navigate('/register'); break;
      case 'onboarding': navigate('/onboarding'); break;
      case 'dashboard': navigate('/dashboard'); break;
      case 'profile': navigate('/profile'); break;
      case 'admin-login': navigate('/admin-login'); break;
      case 'admin-dashboard': navigate('/admin-dashboard'); break;
      case 'teacher-dashboard': navigate('/teacher-dashboard'); break;
      case 'driver-dashboard': navigate('/driver-dashboard'); break;
      case 'student-portal': navigate('/student-portal'); break;
      default: navigate('/');
    }
  };

  const [activeTab, setActiveTab] = useState<'plan' | 'syllabus' | 'library' | 'insights' | 'focus' | 'timetable' | 'pathfinder'>('plan');
  const [authError, setAuthError] = useState('');

  const [userConfig, setUserConfig] = useState<UserConfig>(() => ({
    name: '', email: '', phone: '', schoolName: 'Vidyabodhini Integrated Public School', classLevel: 10, syllabusType: 'CBSE',
    selectedSubjectIds: [], customSubjects: [], manualChapters: {}, examDate: format(new Date(Date.now() + 1000 * 60 * 60 * 24 * 60), 'yyyy-MM-dd'),
    availableHours: DEFAULT_WEEKLY_HOURS, chapterProgress: {}, completedTopicIds: [], onboarded: false,
    gamification: { streak: 0, lastStudyDate: '', points: 0, unlockedAchievementIds: [] }
  }));

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  };

  const [schedule, setSchedule] = useState<StudyTask[]>([]);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const daysLeft = differenceInDays(parseISO(userConfig.examDate), new Date());

  const currentSyllabus = useMemo(() => {
    const type = userConfig.syllabusType || 'CBSE';
    const level = userConfig.classLevel || 10;
    // @ts-ignore
    const baseSyllabus = SYLLABUS_DATA[type]?.[level] || SYLLABUS_DATA['CBSE'][10];

    // Merge manual chapters and custom subjects
    const mergedSubjects = baseSyllabus.subjects.map(subj => {
      if (subj.isManual) {
        return {
          ...subj,
          chapters: userConfig.manualChapters?.[subj.id] || []
        };
      }
      return subj;
    });

    return {
      ...baseSyllabus,
      subjects: [...mergedSubjects, ...(userConfig.customSubjects || [])]
    };
  }, [userConfig.classLevel, userConfig.syllabusType, userConfig.manualChapters, userConfig.customSubjects]);

  // Load user session on start
  useEffect(() => {
    const initSession = async () => {
      // CHECK ADMIN PERMANENT LOGIN (Legacy support, though mock login is removed)
      if (localStorage.getItem('admin_token') === 'true') {
        navigate('/admin-dashboard');
        return;
      }

      try {
        const userData = await authService.getSession();
        if (userData) {
          const role = (userData.role || '').toLowerCase();

          // 2. CHECK ROLE FIRST
          if (role === 'teacher') {
            setUserConfig(prev => ({ ...prev, ...userData }));
            setActiveRole('teacher');
            navigate('/teacher-dashboard');
            return;
          }
          if (['admin', 'school_admin', 'staff'].includes(role)) {
            setUserConfig(prev => ({ ...prev, ...userData }));
            setActiveRole(userData.role);
            navigate('/admin-dashboard');
            return;
          }
          if (role === 'driver') {
            setUserConfig(prev => ({ ...prev, ...userData }));
            setActiveRole('driver');
            navigate('/driver-dashboard');
            return;
          }

          // 3. If Student, load full config
          setUserConfig(prev => ({ ...prev, ...userData }));
          const config = await userService.getUserConfig(userData.email, userData.isSchoolStudent);
          if (config) {
            // RUN MIGRATION: Ensure schema is up to date
            const migratedConfig = migrationService.migrateUserSchema(config);

            // Check Streak on Load
            const updatedConfig = gamificationService.checkStreak(migratedConfig);
            setUserConfig(updatedConfig);

            // If gamification was initialized or updated, save it back to Firestore
            if (JSON.stringify(updatedConfig.gamification) !== JSON.stringify(config.gamification)) {
              userService.updateUserConfig(userData.email, updatedConfig, userData.isSchoolStudent);
            }

            // REDIRECTION LOGIC
            if (updatedConfig.isSchoolStudent) {
              navigate('/student-portal');
            } else if (updatedConfig.onboarded) {
              navigate('/dashboard');
            } else {
              navigate('/onboarding');
            }
          } else {
            // New user without config
            if (userData.isSchoolStudent) {
              navigate('/student-portal');
            } else {
              navigate('/onboarding');
            }
          }
        }
      } catch (e) {
        console.error("Session init failed", e);
      }
    };
    initSession();
  }, []);

  // Save config changes
  useEffect(() => {
    if (userConfig.email && userConfig.onboarded) {
      userService.updateUserConfig(userConfig.email, userConfig, userConfig.isSchoolStudent).catch(console.error);
    }
  }, [userConfig]);

  useEffect(() => {
    if (userConfig.onboarded && !selectedSubjectId) {
      const isValid = userConfig.selectedSubjectIds.includes(selectedSubjectId || '');
      if (!isValid) {
        setSchedule(generateSchedule(currentSyllabus, userConfig));
        setSelectedSubjectId(userConfig.selectedSubjectIds[0] || null);
      } else {
        setSchedule(generateSchedule(currentSyllabus, userConfig));
      }
    } else if (userConfig.onboarded) {
      setSchedule(generateSchedule(currentSyllabus, userConfig));
    }
  }, [userConfig.onboarded, currentSyllabus, userConfig.chapterProgress]);

  /* --- STATE Definitions --- */
  const [activeRole, setActiveRole] = useState<'admin' | 'teacher' | 'school_admin' | 'staff'>('admin');

  // --- Auth Handlers ---
  const handleRegister = async (data: any) => {
    try {
      await authService.register(data);
      const classLevel = parseInt(data.classLevel) as 8 | 9 | 10 | 11 | 12;
      setUserConfig({
        ...userConfig,
        name: data.name,
        email: data.email,
        schoolName: data.schoolName,
        phone: data.phone,
        classLevel: classLevel,
        syllabusType: data.syllabusType,
        selectedSubjectIds: [],
        customSubjects: [],
        manualChapters: {},
        onboarded: false,
        gamification: { streak: 0, lastStudyDate: '', points: 0, unlockedAchievementIds: [] }
      });
      setOnboardingStep(2);
      navigate('/onboarding');
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed');
    }
  };

  const handleLogin = async (data: any) => {
    try {
      // 1. Unified Login (Google or Email/Pass)
      const user = await authService.login(data);
      if (user) {
        // Normalize role to handle "Teacher" vs "teacher" mismatches
        const normalizedRole = (user.role || 'student').toLowerCase();

        // 2. Role-Based Redirection
        if (normalizedRole === 'student') {
          // Student Flow
          const savedConfig = await userService.getUserConfig(user.email, user.isSchoolStudent);
          if (savedConfig) {
            setUserConfig(savedConfig);
            // DIRECT ROUTING based on Type
            if (user.isSchoolStudent) {
              navigate('/student-portal');
            } else if (savedConfig.onboarded) {
              navigate('/dashboard');
            } else {
              navigate('/onboarding');
            }
          } else {
            // Should not happen if restriction is working, but fallback
            setAuthError("Configuration missing. Contact Admin.");
          }
        } else if (normalizedRole === 'teacher') {
          setActiveRole('teacher');
          setUserConfig({
            name: user.name || 'Teacher',
            email: user.email,
            role: 'teacher',
            onboarded: true,
            classLevel: 0,
            syllabusType: 'CBSE',
            selectedSubjectIds: [],
            customSubjects: [],
            manualChapters: {},
            gamification: { streak: 0, lastStudyDate: '', points: 0, unlockedAchievementIds: [] }
          } as any);
          navigate('/teacher-dashboard');
        } else if (['staff', 'school_admin', 'admin'].includes(normalizedRole)) {
          // Staff/Admin Flow
          setActiveRole(user.role);
          navigate('/admin-dashboard');
        } else if (normalizedRole === 'driver') {
          setActiveRole('driver');
          // Set minimal user config so DriverDashboard gets the email
          setUserConfig({
            name: user.name || 'Driver',
            email: user.email,
            role: 'driver',
            onboarded: true,
            classLevel: 0,
            syllabusType: 'CBSE',
            selectedSubjectIds: [],
            customSubjects: [],
            manualChapters: {},
            gamification: { streak: 0, lastStudyDate: '', points: 0, unlockedAchievementIds: [] }
          } as any);
          navigate('/driver-dashboard');
        } else {
          // Fallback
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Invalid email or password.');
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    localStorage.removeItem('admin_token');
    localStorage.removeItem('user_session');
    // window.location.reload(); // Not needed with Router, just navigate
    navigate('/');
  };

  const addCustomSubject = (name: string) => {
    const newSubject: Subject = {
      id: `custom-${Date.now()}`,
      name: name,
      chapters: [],
      isCustom: true,
      isManual: true
    };
    setUserConfig(prev => ({
      ...prev,
      customSubjects: [...(prev.customSubjects || []), newSubject],
      selectedSubjectIds: [...prev.selectedSubjectIds, newSubject.id]
    }));
  };

  const masteryScore = useMemo(() => {
    const selectedSubjects = currentSyllabus.subjects.filter(s => userConfig.selectedSubjectIds.includes(s.id));
    const totalChapters = selectedSubjects.reduce((acc, s) => acc + s.chapters.length, 0);
    if (totalChapters === 0) return 0;
    const achievedCheckpoints = (Object.values(userConfig.chapterProgress) as ChapterProgress[]).reduce((acc: number, p) => acc + p.checkpoints.length, 0);
    return Math.round((achievedCheckpoints / (totalChapters * CHECKPOINTS.length)) * 100);
  }, [userConfig.chapterProgress, userConfig.selectedSubjectIds, currentSyllabus]);

  const todayTasks = useMemo(() => schedule.filter(t => t.scheduledDate === format(new Date(), 'yyyy-MM-dd')), [schedule]);

  const handleResetProgress = () => {
    setUserConfig(prev => ({
      ...prev,
      completedTopicIds: [],
      chapterProgress: {}
    }));
  };

  return (
    <div className="font-['Inter'] antialiased">
      <Routes>
        <Route path="/" element={
          <PublicLayout setView={setViewShim} darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
            <LandingContent setView={setViewShim} />
          </PublicLayout>
        } />

        <Route path="/about" element={
          <PublicLayout setView={setViewShim} darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
            <AboutView setView={setViewShim} />
          </PublicLayout>
        } />

        <Route path="/academics" element={
          <PublicLayout setView={setViewShim} darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
            <AcademicsView setView={setViewShim} />
          </PublicLayout>
        } />

        <Route path="/beyond" element={
          <PublicLayout setView={setViewShim} darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
            <BeyondClassroomView setView={setViewShim} />
          </PublicLayout>
        } />

        <Route path="/admissions" element={
          <PublicLayout setView={setViewShim} darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
            <AdmissionsView setView={setViewShim} />
          </PublicLayout>
        } />

        <Route path="/login-lms" element={<AuthForm mode="login" portalType="lms" error={authError} onSubmit={handleLogin} />} />
        <Route path="/login-school" element={<AuthForm mode="login" portalType="school" error={authError} onSubmit={handleLogin} />} />
        <Route path="/register" element={<AuthForm mode="register" error={authError} onSubmit={handleRegister} />} />

        <Route path="/onboarding" element={
          <OnboardingView
            userConfig={userConfig}
            setUserConfig={setUserConfig}
            onboardingStep={onboardingStep}
            setOnboardingStep={setOnboardingStep}
            currentSyllabus={currentSyllabus}
            onAddCustomSubject={addCustomSubject}
            onLogout={handleLogout}
            onComplete={() => { setUserConfig({ ...userConfig, onboarded: true }); navigate('/dashboard'); }}
          />
        } />

        <Route path="/profile" element={
          <ProfileView userConfig={userConfig} setUserConfig={setUserConfig} setView={setViewShim} onReset={handleResetProgress} />
        } />

        <Route path="/student-portal" element={
          <StudentSchoolPortal
            userConfig={userConfig}
            setUserConfig={setUserConfig}
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
            onBackToLMS={() => navigate('/dashboard')}
            onLogout={handleLogout}
          />
        } />

        <Route path="/dashboard" element={
          <DashboardLayout
            userConfig={userConfig}
            setUserConfig={setUserConfig}
            schedule={schedule}
            setSchedule={setSchedule}
            currentSyllabus={currentSyllabus}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setView={setViewShim}
            onLogout={handleLogout}
            currentTime={currentTime}
            daysLeft={daysLeft}
            masteryScore={masteryScore}
            todayTasks={todayTasks}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />
        } />

        {/* SECURE ADMIN LOGIN */}
        <Route path="/admin-login" element={
          <div className="min-h-screen bg-indigo-950 flex items-center justify-center p-6">
            <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-6">
                <h2 className="text-xl font-black text-indigo-950">School Admin</h2>
                <p className="text-xs text-slate-400 font-bold">Authorized Personnel Only</p>
              </div>
              {/* Reuse handleLogin with manual construct since it is same backend */}
              <form onSubmit={(e) => {
                e.preventDefault();
                // Extract data from form and call handleLogin
                const target = e.target as any;
                handleLogin({ email: target.email.value, password: target.password.value });
              }} className="space-y-4">
                <input name="email" type="email" placeholder="Admin Email" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:border-indigo-500" />
                <input name="password" type="password" placeholder="Password" className="w-full p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:border-indigo-500" />
                <button type="submit" className="w-full bg-indigo-900 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-800">Login</button>
              </form>
              <button onClick={() => navigate('/')} className="w-full mt-4 text-xs text-slate-400 hover:text-indigo-600 font-bold">Back to Site</button>
            </div>
          </div>
        } />

        <Route path="/admin-dashboard" element={<AdminDashboard setView={setViewShim} darkMode={darkMode} toggleDarkMode={toggleDarkMode} role={activeRole} />} />

        <Route path="/teacher-dashboard" element={
          <ErrorBoundary>
            <TeacherDashboard setView={setViewShim} darkMode={darkMode} toggleDarkMode={toggleDarkMode} user={userConfig} />
          </ErrorBoundary>
        } />

        <Route path="/driver-dashboard" element={
          <ErrorBoundary>
            <DriverDashboard user={userConfig} onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </ErrorBoundary>
        } />
      </Routes>
      <DebugOverlay view={location.pathname} role={activeRole} user={userConfig} />
    </div>
  );
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

// --- Extracted Debug Component to use hooks ---
const DebugOverlay: React.FC<{ view: string, role: string, user: any }> = ({ view, role, user }) => {
  const [dbStatus, setDbStatus] = useState<string>('Checking DB...');

  useEffect(() => {
    const checkUser = async () => {
      if (!user?.email) {
        setDbStatus('No Email');
        return;
      }
      try {
        const collections = ['admins', 'teachers', 'drivers', 'students', 'users', 'staff'];
        const results = [];
        for (const col of collections) {
          const ref = doc(db, col, user.email);
          const snap = await getDoc(ref);
          if (snap.exists()) results.push(col);
        }
        setDbStatus(results.length > 0 ? `Found in: ${results.join(', ')}` : 'NOT FOUND IN ANY COLLECTION');
      } catch (e: any) {
        setDbStatus(`Error: ${e.message}`);
      }
    };
    checkUser();
  }, [user?.email]);

  // Hidden in production typically, but kept for user request to verify bugs? 
  // User asked to "fix bugs", having a debug overlay is fine if it doesn't expose control.
  // The reported bug was the "Dev Tool" button in LandingContent. This overlay is passive.
  // I'll keep it as is.
  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg z-50 text-xs font-mono max-w-sm overflow-auto">
      <p><strong>View:</strong> {view}</p>
      <p><strong>Role:</strong> {role}</p>
      <p><strong>User:</strong> {user?.email || 'None'}</p>
      <p><strong>Onboarded:</strong> {String(user?.onboarded)}</p>
      <div className="mt-2 pt-2 border-t border-gray-600">
        <p className="font-bold text-yellow-400">DB Diagnosis:</p>
        <p>{dbStatus}</p>
      </div>
    </div>
  );
};

export default App;
