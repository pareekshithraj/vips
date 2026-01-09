import React from 'react';

interface PlaceholderProps {
    title: string;
    description: string;
}

export const PlaceholderModule: React.FC<PlaceholderProps> = ({ title, description }) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center h-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 text-3xl font-black">
                🚧
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">{title}</h2>
            <p className="text-slate-500 max-w-md font-medium">{description}</p>
            <button className="mt-8 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
                Feature Coming Soon
            </button>
        </div>
    );
};
