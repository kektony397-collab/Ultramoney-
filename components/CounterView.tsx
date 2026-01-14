import React, { useMemo } from 'react';
import { DenominationCounts, DENOMINATIONS } from '../types';
import { convertToIndianCurrency, formatCurrency, vibrate } from '../utils/currency';

interface CounterViewProps {
    counts: DenominationCounts;
    shopName: string;
    onCountChange: (denom: number, val: string) => void;
    onShopNameChange: (val: string) => void;
    onSave: () => void;
    total: number;
    isSaving: boolean;
}

export const CounterView: React.FC<CounterViewProps> = ({
    counts,
    shopName,
    onCountChange,
    onShopNameChange,
    onSave,
    total,
    isSaving
}) => {
    
    const words = useMemo(() => convertToIndianCurrency(total), [total]);

    return (
        <div className="fade-in pb-8">
            {/* Hero Total */}
            <div className="text-center py-8">
                <div className="text-6xl font-light tracking-tighter leading-none text-white flex justify-center items-start gap-1">
                    <span className="text-2xl text-neutral-500 font-normal mt-2">₹</span>
                    <span className="font-light">{formatCurrency(total)}</span>
                </div>
                <div className="text-neutral-500 text-sm mt-3 capitalize font-medium">{words}</div>
            </div>

            {/* Shop Input */}
            <div className="bg-[#141414] border border-[#1E1E1E] rounded-3xl p-5 mb-4 shadow-lg active:scale-[0.99] transition-transform duration-200">
                <div className="flex items-center bg-[#1E1E1E] rounded-full px-5 py-2 border border-transparent focus-within:border-white focus-within:bg-[#2C2C2C] focus-within:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all duration-300">
                    <input 
                        type="text" 
                        value={shopName}
                        onChange={(e) => onShopNameChange(e.target.value)}
                        placeholder="Source / Shop Name"
                        className="bg-transparent border-none text-white text-lg w-full outline-none placeholder-neutral-600 font-medium h-10"
                    />
                </div>
            </div>

            {/* Denomination Grid */}
            <div className="space-y-3">
                {DENOMINATIONS.map((denom) => {
                    const count = counts[denom] || 0;
                    const subtotal = count * denom;
                    
                    return (
                        <div key={denom} className="flex items-center bg-[#1E1E1E] rounded-full p-2 pl-6 transition-all duration-300 border border-transparent focus-within:border-white focus-within:bg-[#2C2C2C] focus-within:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            <span className="font-bold text-[#A0A0A0] w-14 text-lg">₹{denom}</span>
                            <span className="text-[#505050] mx-2">×</span>
                            <input 
                                type="tel" 
                                value={count === 0 ? '' : count}
                                onChange={(e) => {
                                    vibrate(5);
                                    onCountChange(denom, e.target.value);
                                }}
                                placeholder=""
                                className="bg-transparent border-none text-white text-xl font-medium w-full outline-none h-10"
                            />
                            <div 
                                className={`
                                    min-w-[70px] px-3 py-1.5 rounded-3xl text-sm font-bold text-center transition-colors duration-300
                                    ${subtotal > 0 ? 'bg-white text-black' : 'bg-[#2C2C2C] text-[#505050]'}
                                `}
                            >
                                {subtotal >= 1000 ? `${subtotal/1000}k` : subtotal}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Save Button */}
            <button 
                onClick={onSave}
                disabled={isSaving}
                className="w-full mt-8 p-4 bg-[#1E1E1E] text-white border border-[#2C2C2C] rounded-full text-lg font-semibold flex items-center justify-center gap-3 active:bg-[#2C2C2C] transition-colors"
            >
                {isSaving ? (
                    <span>Saving...</span>
                ) : (
                    <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>
                        <span>Save to Database</span>
                    </>
                )}
            </button>
        </div>
    );
};