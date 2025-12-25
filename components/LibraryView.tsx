import React, { useState } from 'react';
import { BookOpen, Map, Download, FileText, Search, Filter } from 'lucide-react';
import { Resource, UserConfig, Syllabus } from '../types';
import { RESOURCE_LIBRARY } from '../constants';

interface LibraryViewProps {
    userConfig: UserConfig;
    currentSyllabus: Syllabus;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ userConfig, currentSyllabus }) => {
    const [filterSubject, setFilterSubject] = useState<string>('all');
    const [filterType, setFilterType] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Get relevant subjects (only selected ones)
    const mySubjects = currentSyllabus.subjects.filter(s =>
        userConfig.selectedSubjectIds.includes(s.id)
    );

    const filteredResources = RESOURCE_LIBRARY.filter(res => {
        // 1. Must be for a selected subject
        if (!userConfig.selectedSubjectIds.includes(res.subjectId)) return false;

        // 2. Subject Filter
        if (filterSubject !== 'all' && res.subjectId !== filterSubject) return false;

        // 3. Type Filter
        if (filterType !== 'all' && res.type !== filterType) return false;

        // 4. Search
        if (searchQuery && !res.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;

        return true;
    });

    return (
        <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
                <div>
                    <h2 className="text-2xl font-black text-indigo-950">Digital Library</h2>
                    <p className="text-slate-400 text-sm font-medium">Access official resources, sample papers, and notes.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search resources..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-indigo-600 outline-none font-bold text-xs text-indigo-900"
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        <select
                            value={filterSubject}
                            onChange={(e) => setFilterSubject(e.target.value)}
                            className="px-4 py-3 rounded-xl bg-slate-50 border-r-8 border-transparent outline-none font-bold text-xs text-slate-500 cursor-pointer hover:bg-slate-100"
                        >
                            <option value="all">All Subjects</option>
                            {mySubjects.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>

                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-3 rounded-xl bg-slate-50 border-r-8 border-transparent outline-none font-bold text-xs text-slate-500 cursor-pointer hover:bg-slate-100"
                        >
                            <option value="all">All Types</option>
                            <option value="Sample Paper">Sample Papers</option>
                            <option value="PYQ">Previous Year Qs</option>
                            <option value="Notes">Notes</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-400">
                        <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="font-bold text-sm">No resources found matching your filters.</p>
                    </div>
                ) : (
                    filteredResources.map(res => {
                        const subjectName = mySubjects.find(s => s.id === res.subjectId)?.name || 'Unknown';
                        return (
                            <div key={res.id} className="bg-white p-6 rounded-3xl border shadow-sm hover:shadow-lg transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[9px] font-black uppercase tracking-widest border border-indigo-100">
                                        {subjectName}
                                    </span>
                                    <span className={`px-2 py-1 rounded-md text-[8px] font-bold uppercase ${res.type === 'PYQ' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                        {res.type} {res.year && `• ${res.year}`}
                                    </span>
                                </div>

                                <h4 className="font-black text-indigo-950 text-base leading-tight mb-2 min-h-[3rem]">
                                    {res.title}
                                </h4>

                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50">
                                    <a
                                        href={res.link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-indigo-600 transition-colors"
                                    >
                                        <Download className="w-4 h-4" /> Download
                                    </a>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
