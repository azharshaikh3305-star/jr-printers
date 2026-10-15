import React, { useState, useRef } from 'react';
import { CompleteDesign, PrintView } from '../../types';
import { isApparelType } from '../../data/printAreas';
import { TShirtBaseSvg } from '../common/TShirtBaseSvg';
import { GARMENT_OPTIONS } from '../../data/products';
import { X, Download, ShoppingBag, Eye, CheckCircle2, Layers } from 'lucide-react';

interface DesignPreviewModalProps {
  design: CompleteDesign;
  onClose: () => void;
  onAddToCart: () => void;
  addToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const DesignPreviewModal: React.FC<DesignPreviewModalProps> = ({
  design,
  onClose,
  onAddToCart,
  addToast,
}) => {
  const [activePreviewView, setActivePreviewView] = useState<PrintView>('front');
  const [isExporting, setIsExporting] = useState(false);

  const garment = GARMENT_OPTIONS.find((g) => g.id === design.garmentId) || GARMENT_OPTIONS[0];
  const isApparel = isApparelType(design.garmentId);

  const views: Array<{ id: PrintView; label: string }> = [
    { id: 'front', label: 'Front' },
    { id: 'back', label: 'Back' },
    ...(isApparel
      ? [
          { id: 'leftSleeve' as const, label: 'Left Sleeve' },
          { id: 'rightSleeve' as const, label: 'Right Sleeve' },
        ]
      : []),
  ];

  // High-Res PNG Generator using HTML5 Canvas
  const handleExportPng = async (transparentOnly: boolean = false) => {
    setIsExporting(true);
    addToast(transparentOnly ? 'Generating transparent DTG print file...' : 'Exporting high-resolution mockup...', 'info');

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1500;
      canvas.height = 1800;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context unavailable');

      ctx.clearRect(0, 0, 1500, 1800);

      // If not transparent only, draw fabric color background base
      if (!transparentOnly) {
        ctx.fillStyle = '#f8f8f8';
        ctx.fillRect(0, 0, 1500, 1800);
      }

      // Draw active view's objects scaled up 3x (500x600 -> 1500x1800)
      const objects = design.views[activePreviewView]?.objects || [];
      const sorted = [...objects].sort((a, b) => a.zIndex - b.zIndex);

      for (const obj of sorted) {
        if (obj.visible === false) continue;

        ctx.save();
        const objX = obj.x * 3;
        const objY = obj.y * 3;
        const objW = obj.width * 3;
        const objH = obj.height * 3;

        ctx.translate(objX, objY);
        ctx.rotate((obj.rotation * Math.PI) / 180);
        ctx.scale(obj.flipX ? -1 : 1, obj.flipY ? -1 : 1);
        ctx.globalAlpha = obj.opacity ?? 1;

        if (obj.type === 'text') {
          ctx.font = `${obj.fontWeight || 'bold'} ${(obj.fontSize || 20) * 3}px ${obj.fontFamily || 'sans-serif'}`;
          ctx.fillStyle = obj.textColor || '#000000';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(obj.text || '', 0, 0);
        } else if (obj.imageUrl) {
          // Draw image
          await new Promise<void>((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
              ctx.drawImage(img, -objW / 2, -objH / 2, objW, objH);
              resolve();
            };
            img.onerror = () => resolve();
            img.src = obj.imageUrl!;
          });
        }
        ctx.restore();
      }

      // Trigger download
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${design.title.toLowerCase().replace(/\s+/g, '-')}-${activePreviewView}-${transparentOnly ? 'print-ready' : 'mockup'}.png`;
      a.click();
      addToast('Download started successfully!', 'success');
    } catch (err) {
      addToast('Export failed. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const currentObjects = design.views[activePreviewView]?.objects || [];

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col md:flex-row max-h-[92vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-stone-500 hover:text-stone-900 bg-white/80 backdrop-blur-md rounded-full transition-colors shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Realistic 360 Garment Stage */}
        <div className="w-full md:w-3/5 bg-stone-100 p-8 flex flex-col items-center justify-between relative overflow-hidden">
          {/* View Switcher Chips */}
          <div className="flex items-center gap-1.5 p-1 bg-white/90 backdrop-blur-md rounded-2xl border border-stone-200 shadow-xs text-xs font-bold z-10">
            {views.map((v) => (
              <button
                key={v.id}
                onClick={() => setActivePreviewView(v.id)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activePreviewView === v.id
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          {/* Garment Stage Container */}
          <div className="relative w-72 sm:w-80 md:w-96 aspect-[500/600] my-4 flex items-center justify-center">
            {/* SVG Base */}
            <div className="absolute inset-0 pointer-events-none">
              <TShirtBaseSvg
                color={design.shirtColor}
                view={activePreviewView}
                garmentType={design.garmentId}
                showPrintAreaGuide={false}
              />
            </div>

            {/* Overlay all objects */}
            <div className="absolute inset-0 pointer-events-none">
              {currentObjects
                .filter((o) => o.visible !== false)
                .sort((a, b) => a.zIndex - b.zIndex)
                .map((obj) => (
                  <div
                    key={obj.id}
                    style={{
                      position: 'absolute',
                      left: `${(obj.x / 500) * 100}%`,
                      top: `${(obj.y / 600) * 100}%`,
                      width: `${(obj.width / 500) * 100}%`,
                      height: `${(obj.height / 600) * 100}%`,
                      transform: `translate(-50%, -50%) rotate(${obj.rotation}deg) scale(${obj.flipX ? -1 : 1}, ${obj.flipY ? -1 : 1})`,
                      transformOrigin: 'center center',
                      opacity: obj.opacity ?? 1,
                      zIndex: obj.zIndex + 10,
                    }}
                    className="flex items-center justify-center"
                  >
                    {obj.type === 'text' ? (
                      <div
                        style={{
                          fontFamily: obj.fontFamily || 'Plus Jakarta Sans',
                          fontSize: `${(obj.fontSize || 20) * (340 / 500)}px`,
                          color: obj.textColor || '#000000',
                          fontWeight: obj.fontWeight || 'bold',
                          fontStyle: obj.fontStyle || 'normal',
                          textDecoration: obj.textDecoration || 'none',
                          textAlign: obj.textAlign || 'center',
                          letterSpacing: `${obj.letterSpacing || 0}px`,
                          lineHeight: obj.lineHeight || 1.1,
                        }}
                        className="w-full h-full flex items-center justify-center select-none text-center break-words px-1"
                      >
                        {obj.text}
                      </div>
                    ) : (
                      <img
                        src={obj.imageUrl}
                        alt="Artwork"
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>

          <span className="text-[11px] text-stone-500 font-medium">
            {isApparel ? 'Apparel Mockup Preview' : 'Custom Product Mockup Preview'}
          </span>
        </div>

        {/* Right: Technical Summary & Export Options */}
        <div className="w-full md:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800">
              Studio Proof
            </span>
            <h3 className="text-xl font-display font-bold text-stone-900 mt-1">
              {design.title}
            </h3>

            {/* Garment Details Card */}
            <div className="mt-4 p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">{isApparel ? 'Silhouette' : 'Product'}</span>
                <span className="font-semibold text-stone-900">
                  {design.productName || garment.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">{isApparel ? 'Fabric Color' : 'Product Color'}</span>
                <div className="flex items-center gap-1.5 font-semibold text-stone-900">
                  <span
                    className="w-3 h-3 rounded-full border border-stone-300"
                    style={{ backgroundColor: design.shirtColor }}
                  />
                  <span>{design.shirtColorName}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Material</span>
                <span className="font-mono text-stone-900">
                  {design.productMaterial || garment.material}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Active Layers</span>
                <span className="font-mono text-stone-900">
                  Front: {design.views.front?.objects.length || 0} · Back: {design.views.back?.objects.length || 0}
                </span>
              </div>
            </div>

            {/* Export Section */}
            <div className="mt-6">
              <h5 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2.5">
                Download Artwork Files
              </h5>
              <div className="space-y-2">
                <button
                  onClick={() => handleExportPng(false)}
                  disabled={isExporting}
                  className="w-full p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-stone-600" />
                    <span>Download Mockup (PNG)</span>
                  </div>
                  <span className="text-[10px] text-stone-500">1500×1800</span>
                </button>

                <button
                  onClick={() => handleExportPng(true)}
                  disabled={isExporting}
                  className="w-full p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-stone-600" />
                    <span>Transparent Print Layer</span>
                  </div>
                  <span className="text-[10px] text-stone-500">Direct DTG</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom CTAs */}
          <div className="mt-8 pt-4 border-t border-stone-100 space-y-2">
            <button
              onClick={() => {
                onClose();
                onAddToCart();
              }}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Confirm & Add Custom Product to Bag</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-2 text-stone-500 hover:text-stone-900 text-xs text-center font-medium"
            >
              Return to Custom Editor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
