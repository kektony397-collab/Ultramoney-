import React, { useEffect, useState } from 'react';
import { LogEntry } from '../types';
import { getLogs, clearLogs } from '../services/db';
import { formatCurrency } from '../utils/currency';

interface HistoryViewProps {
    refreshTrigger: number;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ refreshTrigger }) => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);

    const loadHistory = async () => {
        setLoading(true);
        try {
            const data = await getLogs();
            setLogs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = async () => {
        if (window.confirm("Are you sure you want to clear all history?")) {
            await clearLogs();
            await loadHistory();
        }
    };

    useEffect(() => {
        loadHistory();
    }, [refreshTrigger]);

    return (
        <div className="fade-in pb-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-light text-white">History <span className="text-neutral-500">Log</span></h2>
                <button 
                    onClick={handleClear}
                    className="text-neutral-500 font-bold text-xs bg-[#1E1E1E] px-3 py-1 rounded-full hover:bg-neutral-800 transition-colors"
                >
                    CLEAR
                </button>
            </div>

            <div className="bg-[#141414] border border-[#1E1E1E] rounded-3xl overflow-hidden min-h-[200px]">
                {loading ? (
                    <div className="p-8 text-center text-neutral-500">Loading IndexedDB...</div>
                ) : logs.length === 0 ? (
                    <div className="p-8 text-center text-neutral-600">No history found</div>
                ) : (
                    <div className="divide-y divide-[#1E1E1E]">
                        {logs.map((log, index) => (
                            <div key={index} className="flex justify-between items-center p-4 hover:bg-[#1a1a1a] transition-colors">
                                <div>
                                    <span className="block text-xs text-neutral-500 font-medium mb-1">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </span>
                                    <span className="text-lg text-white font-medium">{log.shop}</span>
                                </div>
                                <div className="text-lg font-bold text-white">
                                    ₹{formatCurrency(log.total)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};