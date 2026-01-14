import React from 'react';
import { DenominationCounts, DENOMINATIONS } from '../types';
import { convertToIndianCurrency, formatCurrency, formatDate } from '../utils/currency';

interface BankingViewProps {
    counts: DenominationCounts;
    shopName: string;
    total: number;
}

export const BankingView: React.FC<BankingViewProps> = ({ counts, shopName, total }) => {
    const words = convertToIndianCurrency(total);
    const dateStr = formatDate(new Date());

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fade-in pb-8">
            <h2 className="text-3xl font-light mb-6 text-white">Banking <span className="text-neutral-500">Tools</span></h2>

            {/* Cheque Preview */}
            <div className="bg-[#141414] border border-[#1E1E1E] rounded-3xl p-5 mb-4">
                <h4 className="text-[#A0A0A0] text-sm font-medium mb-4 mt-0 uppercase tracking-wide">Cheque Preview</h4>
                
                <div className="relative bg-[#F4F6F8] text-[#1a1a1a] p-5 rounded-xl font-mono overflow-hidden shadow-inner">
                    {/* CTS Watermark */}
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 -rotate-90 text-[0.6rem] opacity-50 tracking-widest font-sans font-bold text-neutral-400">
                        CTS-2010
                    </div>

                    <div className="text-right text-xs font-bold mb-4 tracking-wider">{dateStr}</div>

                    <div className="flex justify-between items-end mb-4">
                        <span className="font-bold text-sm text-neutral-600">Pay</span>
                        <div className="flex-1 ml-3 border-b border-neutral-800 px-2 font-bold text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                            {shopName || "Self"}
                        </div>
                    </div>

                    <div className="flex justify-between items-end mb-6">
                        <span className="font-bold text-sm text-neutral-600">Rupees</span>
                        <div className="flex-1 ml-3 border-b border-neutral-800 px-2 text-sm font-bold leading-tight break-words">
                            {words}
                        </div>
                    </div>

                    <div className="flex justify-between items-end">
                        <div className="flex-1"></div>
                        <div className="border-2 border-neutral-800 bg-white px-3 py-1 text-xl font-bold tracking-tight">
                            ₹{formatCurrency(total)}/-
                        </div>
                    </div>
                </div>

                <button 
                    onClick={handlePrint}
                    className="w-full mt-4 py-3 bg-[#1E1E1E] text-white border border-[#2C2C2C] rounded-full text-sm font-semibold flex items-center justify-center gap-2 active:bg-[#2C2C2C] transition-colors"
                >
                    <span>🖨️</span> Print Cheque / Slip
                </button>
            </div>

            {/* Deposit Slip Data */}
            <div className="bg-[#141414] border border-[#1E1E1E] rounded-3xl p-5 mb-4">
                <h4 className="text-[#A0A0A0] text-sm font-medium mb-4 mt-0 uppercase tracking-wide">Deposit Slip Data</h4>
                <div className="font-mono text-sm leading-relaxed text-neutral-300 bg-[#0a0a0a] p-4 rounded-xl border border-[#1E1E1E]">
                    {Object.values(counts).some((v: any) => v > 0) ? (
                        DENOMINATIONS.filter(d => (counts[d] || 0) > 0).map(denom => (
                            <div key={denom} className="flex justify-between border-b border-neutral-900 py-1 last:border-0">
                                <span>₹{denom} x {counts[denom]}</span>
                                <span className="font-bold text-white">= ₹{formatCurrency(denom * counts[denom])}</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-neutral-600 italic">No cash entered yet.</div>
                    )}
                    {total > 0 && (
                        <div className="flex justify-between border-t border-neutral-700 pt-2 mt-2 text-white">
                            <span>Total</span>
                            <span className="font-bold">= ₹{formatCurrency(total)}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};