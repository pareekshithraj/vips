import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export const Diagnostic = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const log = (msg: string) => setLogs(p => [...p, msg]);

    useEffect(() => {
        const check = async () => {
            log('--- DIAGNOSTIC START ---');

            // Check Teachers
            log('Checking "teachers/vijay@vips.in"...');
            try {
                const ref = doc(db, 'teachers', 'vijay@vips.in');
                const snap = await getDoc(ref);
                if (snap.exists()) {
                    log(`✅ FOUND: ${JSON.stringify(snap.data())}`);
                } else {
                    log('❌ NOT FOUND. Did you run Seed Data?');
                    // Check normalized
                    const refNorm = doc(db, 'teachers', 'vijay@vips.in'.toLowerCase());
                    const snapNorm = await getDoc(refNorm);
                    log(`Checking lowercase: ${snapNorm.exists() ? 'FOUND' : 'NOT FOUND'}`);
                }
            } catch (e: any) {
                log(`❌ ERROR: ${e.message}`);
            }

            // Check Drivers
            log('Checking "drivers/driver@vidyabodhini.org"...');
            try {
                const dRef = doc(db, 'drivers', 'driver@vidyabodhini.org');
                const dSnap = await getDoc(dRef);
                log(dSnap.exists() ? '✅ FOUND' : '❌ NOT FOUND');
            } catch (e) { }

            log('--- DIAGNOSTIC END ---');
        };
        check();
    }, []);

    return (
        <div className="fixed bottom-4 right-4 bg-black/90 text-green-400 p-4 rounded-xl z-[9999] font-mono text-xs max-w-sm pointer-events-none shadow-2xl border border-green-900">
            <h3 className="text-white font-bold mb-2">DB Debugger</h3>
            <pre className="whitespace-pre-wrap">{logs.join('\n')}</pre>
        </div>
    );
};
