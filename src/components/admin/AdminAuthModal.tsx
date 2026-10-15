import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, KeyRound, ArrowRight, ArrowLeft } from 'lucide-react';

export const AdminAuthModal: React.FC = () => {
  const { loginAdmin, navigateTo } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleKeypadPress = (val: string) => {
    if (pin.length < 10) {
      setPin((prev) => prev + val);
      setError(false);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const handleClear = () => {
    setPin('');
    setError(false);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pin.trim()) {
      setError(true);
      return;
    }
    const success = loginAdmin(pin.trim());
    if (!success) {
      setError(true);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-2xl text-center">
        {/* Top Logo / Lock Badge */}
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-stone-950 flex items-center justify-center font-display font-black text-2xl mx-auto shadow-md border border-amber-300 mb-4">
          JR
          <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center border-2 border-white shadow-xs">
            <Lock className="w-3 h-3 text-amber-400" />
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-display font-black text-stone-900 tracking-tight uppercase">
          JR PRINTING WORKS
        </h2>
        <p className="text-xs font-bold text-amber-800 tracking-wide mt-0.5">
          Pro. Shaikh Sameer · Owner & Admin Portal
        </p>
        <p className="text-xs text-stone-500 mt-2 mb-6">
          Enter your 4-digit security PIN to access live orders, product pricing, and database sync.
        </p>

        {/* PIN Input Field */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative max-w-[240px] mx-auto">
            <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              inputMode="numeric"
              maxLength={10}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              placeholder="••••"
              className={`w-full tracking-[0.5em] text-center font-mono font-black text-lg py-3 pl-10 pr-4 rounded-xl border transition-all outline-none ${
                error
                  ? 'border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-200'
                  : 'border-stone-300 bg-stone-50 text-stone-900 focus:border-stone-900 focus:bg-white'
              }`}
              autoFocus
            />
          </div>

          {error && (
            <p className="text-xs text-rose-600 font-semibold animate-shake">
              Incorrect Security PIN. Please try again.
            </p>
          )}

          {/* Quick On-Screen Number Keypad for touch devices */}
          <div className="grid grid-cols-3 gap-2 max-w-[260px] mx-auto pt-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeypadPress(digit)}
                className="py-3 rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-amber-100 text-stone-900 font-bold text-base transition-colors font-mono shadow-2xs active:scale-95"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-500 font-semibold text-xs transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleKeypadPress('0')}
              className="py-3 rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-amber-100 text-stone-900 font-bold text-base transition-colors font-mono shadow-2xs active:scale-95"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 font-semibold text-xs transition-colors"
            >
              ⌫
            </button>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full max-w-[260px] mx-auto py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Unlock Admin Panel</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-1 hover:text-stone-900 font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Store</span>
          </button>
        </div>
      </div>
    </div>
  );
};
