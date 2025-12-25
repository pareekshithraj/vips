
import React from 'react';
import { Trophy, Medal, User } from 'lucide-react';
import { gamificationService } from '../services/gamification';

export const Leaderboard: React.FC = () => {
    const [data, setData] = React.useState<any[]>([]);

    React.useEffect(() => {
        gamificationService.getLeaderboard().then(setData).catch(err => console.error(err));
    }, []);

    return (
        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                    <Trophy className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-black text-indigo-950 text-sm uppercase tracking-wider">Top Performers</h3>
                    <p className="text-[10px] text-slate-400 font-bold">This Week's Leaders</p>
                </div>
            </div>

            <div className="space-y-3">
                {data.length === 0 ? (
                    <div className="text-center text-slate-400 text-xs py-4">Loading leaderboard...</div>
                ) : (
                    data.map((student, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-black text-xs ${idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                                    idx === 1 ? 'bg-slate-100 text-slate-600' :
                                        idx === 2 ? 'bg-orange-100 text-orange-700' :
                                            'bg-white border text-slate-400'
                                    }`}>
                                    {idx < 3 ? <Medal className="w-4 h-4" /> : `#${idx + 1}`}
                                </div>
                                <div>
                                    <h4 className="font-bold text-indigo-950 text-xs">{student.name}</h4>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase">Class {student.class}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-indigo-600 text-xs">{student.points}</p>
                                <p className="text-[8px] text-slate-400 font-bold uppercase">Points</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="pt-3 border-t border-slate-50 text-center">
                <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">View All Rankings</button>
            </div>
        </div>
    );
};
