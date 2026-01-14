import React, { useState, useEffect } from 'react';
import { CounterView } from './components/CounterView';
import { BankingView } from './components/BankingView';
import { HistoryView } from './components/HistoryView';
import { DenominationCounts, ViewType } from './types';
import { addLog } from './services/db';
import { vibrate } from './utils/currency';

function App() {
    const [activeView, setActiveView] = useState<ViewType>('counter');
    const [counts, setCounts] = useState<DenominationCounts>({});
    const [shopName, setShopName] = useState<string>('');
    const [total, setTotal] = useState<number>(0);
    const [refreshHistoryTrigger, setRefreshHistoryTrigger] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    // Calculate total whenever counts update
    useEffect(() => {
        let newTotal = 0;
        Object.entries(counts).forEach(([denom, count]) => {
            newTotal += Number(denom) * (count as number);
        });
        setTotal(newTotal);
    }, [counts]);

    const handleCountChange = (denom: number, val: string) => {
        const numVal = parseInt(val) || 0;
        setCounts(prev => ({
            ...prev,
            [denom]: numVal
        }));
    };

    const handleSave = async () => {
        if (total === 0) {
            alert("Counter Empty");
            return;
        }

        setIsSaving(true);
        try {
            await addLog({
                shop: shopName || "Unknown",
                total: total,
                breakdown: counts,
                timestamp: new Date() // Will be set by service, but service wrapper handles serialization
            });
            vibrate([50, 50, 50]);
            setRefreshHistoryTrigger(prev => prev + 1);
            // Optional: reset shop name but keep counts? Original app kept state.
        } catch (e) {
            console.error(e);
            alert("Failed to save");
        } finally {
            setIsSaving(false);
        }
    };

    const handleNav = (view: ViewType) => {
        if (activeView !== view) {
            vibrate(10);
            setActiveView(view);
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-md mx-auto relative overflow-hidden">
            {/* Header */}
            <header className="px-6 py-5 flex justify-between items-center bg-black/80 backdrop-blur-xl z-50 sticky top-0">
                <div className="text-2xl font-medium tracking-tight text-white">
                    Cash<span className="font-extralight text-[#A0A0A0]">Ultra</span>
                </div>
                <div className="w-8 h-8 bg-[#1E1E1E] rounded-full grid place-items-center shadow-lg">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                    </svg>
                </div>
            </header>

            {/* Scroll Container */}
            <main className="flex-1 overflow-y-auto px-4 pb-32 scroll-smooth">
                {activeView === 'counter' && (
                    <CounterView 
                        counts={counts}
                        shopName={shopName}
                        onCountChange={handleCountChange}
                        onShopNameChange={setShopName}
                        total={total}
                        onSave={handleSave}
                        isSaving={isSaving}
                    />
                )}

                {activeView === 'banking' && (
                    <BankingView 
                        counts={counts}
                        shopName={shopName}
                        total={total}
                    />
                )}

                {activeView === 'history' && (
                    <HistoryView refreshTrigger={refreshHistoryTrigger} />
                )}
                
                {/* Footer Attribution */}
                <footer className="text-center text-[10px] text-neutral-600 mt-8 mb-4">
                    created by Yash K Pathak
                </footer>
            </main>

            {/* Nav Dock */}
            <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-[#1E1E1E] border border-[#2C2C2C] rounded-full p-2 flex gap-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50">
                <button 
                    onClick={() => handleNav('counter')}
                    className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${activeView === 'counter' ? 'bg-white text-black shadow-lg scale-105' : 'text-[#A0A0A0] hover:text-white'}`}
                >
                    Input
                </button>
                <button 
                    onClick={() => handleNav('banking')}
                    className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${activeView === 'banking' ? 'bg-white text-black shadow-lg scale-105' : 'text-[#A0A0A0] hover:text-white'}`}
                >
                    Banking
                </button>
                <button 
                    onClick={() => handleNav('history')}
                    className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${activeView === 'history' ? 'bg-white text-black shadow-lg scale-105' : 'text-[#A0A0A0] hover:text-white'}`}
                >
                    History
                </button>
            </nav>
        </div>
    );
}

export default App;