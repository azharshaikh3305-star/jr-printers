import React, { useState } from 'react';
import { X, Ruler, Check, Info } from 'lucide-react';
import { SIZE_CHART_DATA } from '../../data/products';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSize?: string;
  onSelectSize?: (size: string) => void;
  garmentName?: string;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  selectedSize,
  onSelectSize,
  garmentName = 'Studio T-Shirt',
}) => {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [activeFitTab, setActiveFitTab] = useState<'all' | 'regular' | 'oversized'>('all');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-stone-900">
                Official Garment Size & Fit Guide
              </h3>
              <p className="text-xs text-stone-500">
                Precision measurements for {garmentName} (Pre-shrunk ring-spun cotton)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors"
            aria-label="Close size guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Unit Toggle & Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-700">Display Units:</span>
              <div className="flex bg-white rounded-lg p-0.5 border border-stone-200">
                <button
                  onClick={() => setUnit('in')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    unit === 'in'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Inches (in)
                </button>
                <button
                  onClick={() => setUnit('cm')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    unit === 'cm'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Centimeters (cm)
                </button>
              </div>
            </div>

            <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>All 11 sizes from XXS to 6XL are custom made with zero shrinkage.</span>
            </div>
          </div>

          {/* Measurements Table Covering All Sizes */}
          <div className="overflow-x-auto border border-stone-200 rounded-2xl">
            <table className="w-full text-xs text-stone-800 text-left border-collapse">
              <thead>
                <tr className="bg-stone-100/70 border-b border-stone-200 text-stone-600 uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Chest ({unit})</th>
                  <th className="py-3 px-4">Body Length ({unit})</th>
                  <th className="py-3 px-4">Shoulder Width ({unit})</th>
                  <th className="py-3 px-4">Sleeve Length ({unit})</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
                {SIZE_CHART_DATA.map((row) => {
                  const isCurrent = selectedSize === row.size;
                  return (
                    <tr
                      key={row.size}
                      className={`hover:bg-amber-50/50 transition-colors ${
                        isCurrent ? 'bg-amber-50/80 font-bold' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-sans font-extrabold text-stone-900 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center font-bold text-xs border border-stone-200">
                          {row.size}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] bg-stone-900 text-white px-2 py-0.5 rounded-full font-mono">
                            Selected
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-semibold text-stone-800">
                        {unit === 'in' ? row.chestInches : row.chestCm}
                      </td>
                      <td className="py-3 px-4 text-stone-700">
                        {unit === 'in' ? row.lengthInches : row.lengthCm}
                      </td>
                      <td className="py-3 px-4 text-stone-700">
                        {unit === 'in' ? row.shoulderInches : `${Math.round(parseFloat(row.shoulderInches) * 2.54)} cm`}
                      </td>
                      <td className="py-3 px-4 text-stone-700">
                        {unit === 'in' ? row.sleeveInches : `${Math.round(parseFloat(row.sleeveInches) * 2.54)} cm`}
                      </td>
                      <td className="py-3 px-4 text-center font-sans">
                        {onSelectSize ? (
                          <button
                            onClick={() => {
                              onSelectSize(row.size);
                              onClose();
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                              isCurrent
                                ? 'bg-emerald-600 text-white'
                                : 'bg-stone-900 hover:bg-stone-800 text-white'
                            }`}
                          >
                            {isCurrent ? 'Current' : 'Select'}
                          </button>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* How To Measure Guide */}
          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-stone-900">
              How To Find Your Ideal Fit
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-600">
              <div className="p-3 bg-white rounded-xl border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">1. Chest Width</span>
                <p className="leading-relaxed text-[11px]">
                  Place tape under arms around the fullest part of chest. Keep tape flat and comfortably relaxed.
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">2. Body Length</span>
                <p className="leading-relaxed text-[11px]">
                  Measure from the highest point of the neck collar seam down to the bottom hem of the shirt.
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">3. Fit Style</span>
                <p className="leading-relaxed text-[11px]">
                  For a true streetwear boxy silhouette, pick your standard size. For an oversized fit, size up 1 step.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            Need custom batch sizing advice? Contact our textile advisors anytime.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
