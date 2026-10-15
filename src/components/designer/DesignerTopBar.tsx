import React, { useState } from 'react';
import { CompleteDesign, PrintView } from '../../types';
import { isApparelType } from '../../data/printAreas';
import { GARMENT_OPTIONS, JR_INFO } from '../../data/products';
import {
  Undo2,
  Redo2,
  Eye,
  Save,
  RotateCcw,
  ShoppingBag,
  Compass,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';

interface DesignerTopBarProps {
  design: CompleteDesign;
  activeView: PrintView;
  setActiveView: (view: PrintView) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  smartGuidesEnabled: boolean;
  setSmartGuidesEnabled: (val: boolean) => void;
  zoomLevel: number;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  onSaveDesign: () => void;
  onResetDesign: () => void;
  onOpenPreview: () => void;
  onAddToCart: () => void;
}

export const DesignerTopBar: React.FC<DesignerTopBarProps> = ({
  design,
  activeView,
  setActiveView,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  smartGuidesEnabled,
  setSmartGuidesEnabled,
  zoomLevel,
  setZoomLevel,
  onSaveDesign,
  onResetDesign,
  onOpenPreview,
  onAddToCart,
}) => {
  const [resetModalOpen, setResetModalOpen] = useState(false);

  // Dynamic live pricing computation:
  // Base garment price
  const garmentOpt = GARMENT_OPTIONS.find((g) => g.id === design.garmentId) || GARMENT_OPTIONS[0];
  const isApparel = isApparelType(design.garmentId);
  const basePrice = design.productBasePrice ?? garmentOpt.basePrice;
  const itemLabel = isApparel
    ? 'Custom Tee'
    : {
        'ceramic-cup': 'Custom Cup',
        'photo-pillow': 'Custom Pillow',
        'sipper-bottle': 'Custom Bottle',
        keychain: 'Custom Keychain',
        'photo-frame': 'Custom Photo Frame',
        'mobile-case': 'Custom Phone Case',
        'classic-crew': 'Custom Tee',
        'heavyweight-tee': 'Custom Tee',
        'oversized-boxy': 'Custom Tee',
        'french-terry-hoodie': 'Custom Hoodie',
        'pique-polo': 'Custom Polo',
      }[design.garmentId];

  // Print locations costs
  const hasFront = (design.views.front?.objects || []).length > 0;
  const hasBack = (design.views.back?.objects || []).length > 0;
  const hasLeftSleeve = (design.views.leftSleeve?.objects || []).length > 0;
  const hasRightSleeve = (design.views.rightSleeve?.objects || []).length > 0;

  const frontPrintCost = hasFront ? 199 : 0;
  const backPrintCost = hasBack ? 199 : 0;
  const sleevePrintCost = isApparel ? (hasLeftSleeve ? 99 : 0) + (hasRightSleeve ? 99 : 0) : 0;

  const totalCalculatedPrice = basePrice + frontPrintCost + backPrintCost + sleevePrintCost;

  const viewsList: Array<{ id: PrintView; label: string; count: number }> = [
    { id: 'front', label: 'Front', count: design.views.front?.objects.length || 0 },
    { id: 'back', label: 'Back', count: design.views.back?.objects.length || 0 },
    ...(isApparel
      ? [
          { id: 'leftSleeve' as const, label: 'L Sleeve', count: design.views.leftSleeve?.objects.length || 0 },
          { id: 'rightSleeve' as const, label: 'R Sleeve', count: design.views.rightSleeve?.objects.length || 0 },
        ]
      : []),
  ];

  return (
    <>
      <div className="h-16 bg-white border-b border-stone-200 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 shrink-0 select-none z-30 overflow-x-auto scrollbar-none">
        {/* Left Section: JR Brand Badge + Undo, Redo, Smart Guides, Zoom */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-2 pr-2 border-r border-stone-200">
            <div className="w-7 h-7 rounded-lg bg-amber-400 text-stone-950 font-black text-xs flex items-center justify-center font-display shadow-2xs">
              JR
            </div>
            <div>
              <div className="text-[11px] font-black text-stone-900 leading-none">JR PRINTING WORKS</div>
              <div className="text-[9px] text-amber-700 font-semibold leading-tight">Pro. Shaikh Sameer</div>
            </div>
          </div>

          {/* Undo / Redo */}
          <div className="flex items-center border border-stone-200 rounded-xl p-1 bg-stone-50">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={`p-1.5 rounded-lg transition-colors ${
                canUndo ? 'text-stone-800 hover:bg-white hover:shadow-2xs' : 'text-stone-300 cursor-not-allowed'
              }`}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className={`p-1.5 rounded-lg transition-colors ${
                canRedo ? 'text-stone-800 hover:bg-white hover:shadow-2xs' : 'text-stone-300 cursor-not-allowed'
              }`}
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Smart Guides Toggle */}
          <button
            onClick={() => setSmartGuidesEnabled(!smartGuidesEnabled)}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              smartGuidesEnabled
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
            title="Toggle Canva-style Center & Alignment Smart Guides"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Smart Guides</span>
          </button>

          {/* Zoom controls */}
          <div className="hidden md:flex items-center border border-stone-200 rounded-xl p-1 bg-stone-50 text-xs">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.75, Math.round((z - 0.15) * 100) / 100))}
              className="p-1 hover:bg-white rounded text-stone-600 hover:text-stone-900"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] font-bold text-stone-700">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.4, Math.round((z + 0.15) * 100) / 100))}
              className="p-1 hover:bg-white rounded text-stone-600 hover:text-stone-900"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center Section: Product print views */}
        <div className="flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200/80">
          {viewsList.map((v) => (
            <button
              key={v.id}
              onClick={() => setActiveView(v.id)}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === v.id
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>{v.label}</span>
              {v.count > 0 && (
                <span className="w-4 h-4 rounded-full bg-stone-900 text-white font-mono text-[10px] flex items-center justify-center">
                  {v.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Right Section: Live Price, Preview, Save, Add to Cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Price Pill */}
          <div className="hidden lg:flex flex-col items-end mr-1">
            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">
              Live Custom Price
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold font-mono text-stone-900 tabular-nums">
                ₹{totalCalculatedPrice}
              </span>
              <span className="text-[10px] text-stone-500">
                (₹{basePrice} base
                {frontPrintCost > 0 ? ' +₹199 front' : ''}
                {backPrintCost > 0 ? ' +₹199 back' : ''}
                {sleevePrintCost > 0 ? ` +₹${sleevePrintCost} sleeves` : ''})
              </span>
            </div>
          </div>

          {/* Reset Design */}
          <button
            onClick={() => setResetModalOpen(true)}
            className="p-2 text-stone-500 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-colors"
            title="Reset Design"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Realistic 360 Preview */}
          <button
            onClick={onOpenPreview}
            className="px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-800 hover:bg-stone-50 transition-colors flex items-center gap-1.5"
            title="Preview 3D and export high-res artwork"
          >
            <Eye className="w-4 h-4 text-stone-600" />
            <span className="hidden sm:inline">Preview</span>
          </button>

          {/* Save Design */}
          <button
            onClick={onSaveDesign}
            className="px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-800 hover:bg-stone-50 transition-colors flex items-center gap-1.5"
            title="Save to My Archive"
          >
            <Save className="w-4 h-4 text-stone-600" />
            <span className="hidden sm:inline">Save</span>
          </button>

          {/* WhatsApp Consultation */}
          <a
            href={JR_INFO.whatsapp1Link}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition-colors"
            title="Ask Pro. Shaikh Sameer on WhatsApp for printing advice"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-emerald-600" />
            <span>WhatsApp (7888162822)</span>
          </a>

          {/* Add to Cart Primary CTA */}
          <button
            onClick={onAddToCart}
            className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add {itemLabel} (₹{totalCalculatedPrice})</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Reset Design */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 shadow-2xl border border-stone-200">
            <h3 className="text-base font-bold text-stone-900 font-display">Reset Custom Design?</h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Are you sure you want to reset your design? All uploaded graphics, vector stickers, and text across front, back, and sleeves will be removed.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setResetModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetDesign();
                  setResetModalOpen(false);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Reset Design
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
