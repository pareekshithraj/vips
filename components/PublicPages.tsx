import React from 'react';
import {
    BookOpen, Users, Trophy, Calendar, MapPin, Phone, Mail,
    Clock, CheckCircle, ArrowRight, GraduationCap, Star, Heart,
    Globe, Shield, Award, Send
} from 'lucide-react';
import { managementService } from '../services/management';

interface PageProps {
    setView: (view: any) => void;
}

export const AboutView: React.FC<PageProps> = ({ setView }) => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-emerald-900 text-white py-20 px-6 text-center rounded-b-[3rem] mb-12">
            <h1 className="text-4xl md:text-6xl font-black mb-6">Our Legacy</h1>
            <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
                Since 1995, Vidyabodhini has been a beacon of educational excellence, shaping the leaders of tomorrow.
            </p>
        </div>

        <div className="max-w-5xl mx-auto px-6 space-y-20 pb-20">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-3xl font-black text-emerald-950 mb-6">Principal's Message</h2>
                    <p className="text-slate-600 leading-relaxed mb-6">
                        "Education is not just about filling a bucket, but lighting a fire. At Vidyabodhini, we strive to ignite the curiosity within every child. Our holistic approach ensures that students not only excel academically but also grow into compassionate, responsible global citizens."
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                        <div>
                            <p className="font-bold text-emerald-950">Dr. Sarah Johnson</p>
                            <p className="text-xs text-slate-500 uppercase tracking-widest">Principal</p>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-100 rounded-[2rem] h-80 w-full"></div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {[
                    { icon: Globe, title: "Vision", desc: "To be a global center of learning that nurtures creativity and character." },
                    { icon: Heart, title: "Mission", desc: "Empowering students with knowledge, skills, and values for a changing world." },
                    { icon: Shield, title: "Values", desc: "Integrity, Excellence, Empathy, and Innovation." }
                ].map((item, i) => (
                    <div key={i} className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                            <item.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black text-emerald-950 mb-3">{item.title}</h3>
                        <p className="text-slate-500 text-sm">{item.desc}</p>
                    </div>
                ))}
            </section>
        </div>
    </div>
);

export const AcademicsView: React.FC<PageProps> = ({ setView }) => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-blue-900 text-white py-20 px-6 text-center rounded-b-[3rem] mb-12">
            <h1 className="text-4xl md:text-6xl font-black mb-6">Academic Excellence</h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                A rigorous, student-centered curriculum designed to challenge and inspire.
            </p>
        </div>

        <div className="max-w-6xl mx-auto px-6 pb-20">
            <div className="grid grid-cols-1 gap-12">
                {[
                    { title: "Primary Years (KG - Grade 5)", desc: "Focus on literacy, numeracy, and social skills through play-based and inquiry-based learning.", color: "bg-orange-50", text: "text-orange-900", accent: "bg-orange-500" },
                    { title: "Middle School (Grade 6 - 8)", desc: "Transition to subject-specific learning with a focus on critical thinking and project-based assessments.", color: "bg-blue-50", text: "text-blue-900", accent: "bg-blue-500" },
                    { title: "Senior School (Grade 9 - 12)", desc: "Intensive preparation for Board Exams (CBSE) along with career counseling and competitive exam coaching.", color: "bg-emerald-50", text: "text-emerald-900", accent: "bg-emerald-500" }
                ].map((level, i) => (
                    <div key={i} className={`p-10 rounded-[2.5rem] ${level.color} flex flex-col md:flex-row gap-8 items-start`}>
                        <div className={`w-16 h-16 ${level.accent} text-white rounded-2xl flex items-center justify-center font-black text-2xl shrink-0`}>
                            {i + 1}
                        </div>
                        <div>
                            <h2 className={`text-2xl font-black ${level.text} mb-4`}>{level.title}</h2>
                            <p className="text-slate-600 text-lg leading-relaxed mb-6">{level.desc}</p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {['Expert Faculty', 'Smart Classrooms', 'Regular Assessments', 'Remedial Support'].map((feat, j) => (
                                    <li key={j} className="flex items-center gap-2 text-sm font-bold text-slate-500">
                                        <CheckCircle className="w-4 h-4" /> {feat}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export const BeyondClassroomView: React.FC<PageProps> = ({ setView }) => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-orange-900 text-white py-20 px-6 text-center rounded-b-[3rem] mb-12">
            <h1 className="text-4xl md:text-6xl font-black mb-6">Beyond The Classroom</h1>
            <p className="text-orange-100 text-lg max-w-2xl mx-auto">
                Sports, Arts, and Leadership - building well-rounded personalities.
            </p>
        </div>

        <div className="max-w-6xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
                { title: "Sports Academy", desc: "Cricket, Football, Basketball, and Swimming with professional coaches.", icon: Trophy },
                { title: "Performing Arts", desc: "Music, Dance, and Theater clubs to unleash creativity.", icon: Star },
                { title: "Robotics & AI", desc: "STEM labs equipped with the latest technology.", icon: Globe },
                { title: "Community Service", desc: "NSS and social outreach programs.", icon: Heart }
            ].map((item, i) => (
                <div key={i} className="group bg-white p-8 rounded-3xl border border-slate-100 hover:border-orange-200 hover:shadow-xl transition-all">
                    <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <item.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-3">{item.title}</h3>
                    <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
            ))}
        </div>
    </div>
);

export const AdmissionsView: React.FC<PageProps> = ({ setView }) => {
    const [form, setForm] = React.useState({ studentName: '', parentName: '', grade: '1', phone: '', email: '', message: '' });
    const [loading, setLoading] = React.useState(false);
    const [submitted, setSubmitted] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await managementService.submitAdmissionRequest(form as any);
            setSubmitted(true);
        } catch (e) {
            console.error(e);
            alert("Failed to submit request. Please try again or contact us directly.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-indigo-900 text-white py-20 px-6 text-center rounded-b-[3rem] mb-12">
                <h1 className="text-4xl md:text-6xl font-black mb-6">Join Our Family</h1>
                <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
                    Admissions open for the Academic Year 2025-26.
                </p>
            </div>

            <div className="max-w-6xl mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Process Steps */}
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 h-fit">
                    <h2 className="text-2xl font-black text-indigo-950 mb-8 text-center">Admission Process</h2>
                    <div className="space-y-8">
                        {[
                            { step: 1, title: "Online Registration", desc: "Fill out the enquiry form or register on our portal." },
                            { step: 2, title: "Campus Visit & Interaction", desc: "Meet our counselors and tour the campus." },
                            { step: 3, title: "Assessment", desc: "Basic aptitude test for Grade 1 onwards." },
                            { step: 4, title: "Document Submission", desc: "Submit previous records and birth certificate." }
                        ].map((s, i) => (
                            <div key={i} className="flex gap-6">
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-full bg-indigo-900 text-white flex items-center justify-center font-black text-sm z-10">
                                        {s.step}
                                    </div>
                                    {i < 3 && <div className="w-0.5 h-full bg-indigo-100 -my-2"></div>}
                                </div>
                                <div className="pb-8">
                                    <h3 className="text-lg font-black text-indigo-950">{s.title}</h3>
                                    <p className="text-slate-500 text-sm">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Enquiry Form */}
                <div className="bg-indigo-50 p-10 rounded-[2.5rem] border border-indigo-100 h-fit">
                    <h2 className="text-2xl font-black text-indigo-950 mb-2">Admission Enquiry</h2>
                    <p className="text-slate-600 mb-8">Fill out the form below and our admissions team will contact you shortly.</p>

                    {submitted ? (
                        <div className="bg-white p-8 rounded-2xl text-center border border-indigo-100 shadow-sm animate-in zoom-in">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-black text-indigo-950 mb-2">Request Submitted!</h3>
                            <p className="text-slate-500 mb-6">Thank you for your interest. We will get back to you within 24 hours.</p>
                            <button onClick={() => setSubmitted(false)} className="text-indigo-600 font-bold text-sm hover:underline">Submit another enquiry</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input required type="text" placeholder="Student Name" className="w-full p-4 rounded-xl border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none font-bold" value={form.studentName} onChange={e => setForm({ ...form, studentName: e.target.value })} />
                                <input required type="text" placeholder="Parent Name" className="w-full p-4 rounded-xl border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none font-bold" value={form.parentName} onChange={e => setForm({ ...form, parentName: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <select className="w-full p-4 rounded-xl border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none font-bold bg-white" value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })}>
                                    <option value="KG">Kindergarten</option>
                                    {[...Array(12)].map((_, i) => <option key={i} value={i + 1}>Grade {i + 1}</option>)}
                                </select>
                                <input required type="tel" placeholder="Phone Number" className="w-full p-4 rounded-xl border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none font-bold" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                            </div>
                            <input required type="email" placeholder="Email Address" className="w-full p-4 rounded-xl border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none font-bold" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                            <textarea placeholder="Message / Questions (Optional)" className="w-full p-4 rounded-xl border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none font-bold h-32 resize-none" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}></textarea>

                            <button disabled={loading} className={`w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-lg uppercase tracking-widest shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70' : ''}`}>
                                {loading ? 'Sending...' : <>Submit Request <Send className="w-5 h-5" /></>}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
