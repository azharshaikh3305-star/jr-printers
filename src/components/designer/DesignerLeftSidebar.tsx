import React, { useState } from 'react';
import {
  GarmentType,
  PrintView,
  DesignObject,
  CompleteDesign,
  Product,
} from '../../types';
import { getPrintAreaBounds, isApparelType } from '../../data/printAreas';
import { GARMENT_OPTIONS, GARMENT_COLORS, PHONE_CASE_MODELS, SAMPLE_PRODUCTS } from '../../data/products';
import { STICKER_LIBRARY, STICKER_CATEGORIES } from '../../data/stickers';
import { STARTER_TEMPLATES } from '../../data/templates';
import {
  Shirt,
  Upload,
  Type,
  Smile,
  Layers,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  ArrowUp,
  ArrowDown,
  Plus,
  Ruler,
} from 'lucide-react';
import { SIZES } from '../../data/products';

interface DesignerLeftSidebarProps {
  design: CompleteDesign;
  activeView: PrintView;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  onAddObject: (obj: Omit<DesignObject, 'id' | 'zIndex'>) => void;
  onUpdateDesignGarment: (garmentId: GarmentType, colorHex: string, colorName: string) => void;
  onSelectProduct: (product: Product) => void;
  onSelectPhoneBrand: (brand: string) => void;
  onLoadTemplate: (templateDesign: CompleteDesign) => void;
  onReorderObject: (id: string, direction: 'up' | 'down') => void;
  onUpdateObject: (id: string, updates: Partial<DesignObject>) => void;
  onDeleteObjects: (ids: string[]) => void;
  addToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  selectedSize?: string;
  onSelectSize?: (size: string) => void;
  onOpenSizeGuide?: () => void;
}

type SidebarTab = 'garment' | 'upload' | 'text' | 'stickers' | 'templates' | 'layers';

export const DesignerLeftSidebar: React.FC<DesignerLeftSidebarProps> = ({
  design,
  activeView,
  selectedIds,
  setSelectedIds,
  onAddObject,
  onUpdateDesignGarment,
  onSelectProduct,
  onSelectPhoneBrand,
  onLoadTemplate,
  onReorderObject,
  onUpdateObject,
  onDeleteObjects,
  addToast,
  selectedSize = 'L',
  onSelectSize,
  onOpenSizeGuide,
}) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('garment');

  // Text Tab State
  const [inputText, setInputText] = useState('CUSTOM');
  const [textFont, setTextFont] = useState('Syne');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textSize, setTextSize] = useState(24);

  // Sticker Category State
  const [selectedStickerCat, setSelectedStickerCat] = useState<string>('Quotes');

  // Uploaded media history for instant re-adding
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{
      url: string;
      name: string;
      width: number;
      height: number;
      sizeKb: number;
      qualityScore: 'good' | 'low';
      isTransparent: boolean;
    }>
  >([]);

  // Current view objects
  const currentObjects = design.views[activeView]?.objects || [];
  const printArea = getPrintAreaBounds(design.garmentId, activeView);
  const printCenterX = printArea.x + printArea.width / 2;
  const printCenterY = printArea.y + printArea.height / 2;
  const isApparel = isApparelType(design.garmentId);
  const isMobileCase = design.garmentId === 'mobile-case';
  const phoneModelVariants = design.productModelVariants || (isMobileCase ? PHONE_CASE_MODELS : {});
  const phoneBrands = Object.keys(phoneModelVariants);
  const selectedPhoneBrand = design.productBrand || phoneBrands[0] || '';
  const phoneModels = phoneModelVariants[selectedPhoneBrand] || [];
  const isDrinkware = design.garmentId === 'ceramic-cup' || design.garmentId === 'sipper-bottle';
  const availableSizes = isMobileCase
    ? phoneModels
    : design.productSizes?.length
      ? design.productSizes
      : SIZES;
  const availableColors = design.productColors?.length ? design.productColors : GARMENT_COLORS;
  const availableGarments = GARMENT_OPTIONS.filter(
    (garment) => isApparelType(garment.id) === isApparel
  );
  const customizableDrinkware = SAMPLE_PRODUCTS.filter(
    (product) => product.garmentType === 'ceramic-cup' || product.garmentType === 'sipper-bottle'
  );

  const fitArtworkToPrintArea = (width: number, height: number) => {
    const scale = Math.min(
      1,
      (printArea.width * 0.75) / width,
      (printArea.height * 0.75) / height
    );
    return { width: Math.round(width * scale), height: Math.round(height * scale) };
  };

  // Handle Multi-file uploads
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        addToast(`Unsupported file type: ${file.name}`, 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const resultUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const width = img.naturalWidth;
          const height = img.naturalHeight;
          const sizeKb = Math.round(file.size / 1024);
          const isTransparent = file.type === 'image/png' || file.type === 'image/webp';

          // Image Quality Check: DPI estimation & resolution
          const isGoodQuality = width >= 400 && height >= 400;
          const qualityScore = isGoodQuality ? 'good' : 'low';

          // Add to local uploaded library
          setUploadedFiles((prev) => [
            {
              url: resultUrl,
              name: file.name,
              width,
              height,
              sizeKb,
              qualityScore,
              isTransparent,
            },
            ...prev,
          ]);

          // Automatically place onto canvas
          const aspect = width / height;
          const fittedSize = fitArtworkToPrintArea(140, 140 / aspect);

          onAddObject({
            type: 'image',
            imageUrl: resultUrl,
            x: printCenterX,
            y: printCenterY,
            width: fittedSize.width,
            height: fittedSize.height,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            opacity: 1,
            locked: false,
            visible: true,
            flipX: false,
            flipY: false,
            keepAspectRatio: true,
            originalWidth: width,
            originalHeight: height,
            fileSizeBytes: file.size,
            fileType: file.type,
            isTransparentPng: isTransparent,
          });

          if (isGoodQuality) {
            addToast(`"${file.name}" uploaded (✓ High Print Quality)`, 'success');
          } else {
            addToast(`"${file.name}" uploaded (⚠ Low Resolution Warning)`, 'warning');
          }
        };
        img.src = resultUrl;
      };
      reader.readAsDataURL(file);
    });
  };

  // Add custom text
  const handleAddText = () => {
    if (!inputText.trim()) return;
    onAddObject({
      type: 'text',
      text: inputText,
      fontFamily: textFont,
      fontSize: textSize,
      textColor: textColor,
      fontWeight: 'bold',
      fontStyle: 'normal',
      textDecoration: 'none',
      textAlign: 'center',
      letterSpacing: 2,
      lineHeight: 1.1,
      x: printCenterX,
      y: printCenterY,
      width: Math.min(printArea.width * 0.8, Math.max(80, inputText.length * 14)),
      height: Math.min(printArea.height * 0.45, Math.max(32, textSize * 1.5)),
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      locked: false,
      visible: true,
      flipX: false,
      flipY: false,
      keepAspectRatio: true,
    });
    addToast('Text added to garment', 'success');
  };

  // Add sticker
  const handleAddSticker = (stickerUri: string, defaultW: number, defaultH: number) => {
    const fittedSize = fitArtworkToPrintArea(defaultW, defaultH);
    onAddObject({
      type: 'sticker',
      imageUrl: stickerUri,
      x: printCenterX,
      y: printCenterY,
      width: fittedSize.width,
      height: fittedSize.height,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      locked: false,
      visible: true,
      flipX: false,
      flipY: false,
      keepAspectRatio: true,
    });
    addToast('Graphic sticker added', 'success');
  };

  const navTabs: Array<{ id: SidebarTab; label: string; icon: React.ReactNode }> = [
    { id: 'garment', label: isApparel ? 'Garment' : 'Product', icon: <Shirt className="w-4 h-4" /> },
    { id: 'upload', label: 'Upload', icon: <Upload className="w-4 h-4" /> },
    { id: 'text', label: 'Text', icon: <Type className="w-4 h-4" /> },
    { id: 'stickers', label: 'Graphics', icon: <Smile className="w-4 h-4" /> },
    { id: 'templates', label: 'Presets', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'layers', label: `Layers (${currentObjects.length})`, icon: <Layers className="w-4 h-4" /> },
  ];

  return (
    <div className="w-80 sm:w-88 h-full bg-white border-r border-stone-200 flex flex-col shrink-0 select-none">
      {/* Icon Navigation Tabs Strip */}
      <div className="flex items-center border-b border-stone-200 overflow-x-auto p-1 bg-stone-50 text-xs">
        {navTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-2.5 rounded-lg flex flex-col items-center gap-1 transition-all whitespace-nowrap text-[11px] font-semibold ${
              activeTab === tab.id
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* 1. GARMENT & FABRIC COLOR TAB */}
        {activeTab === 'garment' && (
          <div className="space-y-6">
            {isApparel && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                  Apparel Silhouette
                </h4>
                <div className="space-y-2">
                  {availableGarments.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() =>
                        onUpdateDesignGarment(
                          opt.id,
                          design.shirtColor,
                          design.shirtColorName
                        )
                      }
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        design.garmentId === opt.id
                          ? 'border-stone-900 bg-stone-50 shadow-xs'
                          : 'border-stone-200 hover:border-stone-400 bg-white'
                      }`}
                    >
                      <div>
                        <h5 className="text-xs font-bold text-stone-900">{opt.name}</h5>
                        <p className="text-[11px] text-stone-500">{opt.subtitle}</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-stone-900 tabular-nums">
                        ₹{opt.basePrice}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {isMobileCase && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Choose Phone Brand & Model
                </h4>
                <label className="block">
                  <span className="text-[11px] font-semibold text-stone-600">Brand</span>
                  <select
                    value={selectedPhoneBrand}
                    onChange={(event) => onSelectPhoneBrand(event.target.value)}
                    className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs font-semibold text-stone-900"
                  >
                    {phoneBrands.map((brand) => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-[11px] font-semibold text-stone-600">Phone Model</span>
                  <select
                    value={selectedSize}
                    onChange={(event) => onSelectSize?.(event.target.value)}
                    className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs font-semibold text-stone-900"
                  >
                    {phoneModels.map((model) => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </label>
              </div>
            )}
            {isDrinkware && customizableDrinkware.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                  Choose Product
                </h4>
                <div className="space-y-2">
                  {customizableDrinkware.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => onSelectProduct(product)}
                      className={`w-full p-3 rounded-xl border text-left transition-all ${
                        design.sourceProductId === product.id
                          ? 'border-stone-900 bg-stone-50 shadow-xs'
                          : 'border-stone-200 hover:border-stone-400 bg-white'
                      }`}
                    >
                      <span className="block text-xs font-bold text-stone-900">
                        {product.garmentType === 'ceramic-cup' ? 'Cup / Mug' : 'Bottle'}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-stone-500">{product.name}</span>
                      <span className="mt-1 block text-xs font-mono font-bold text-stone-900">
                        ₹{product.basePrice}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Swatches */}
            <div className="pt-4 border-t border-stone-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  {isApparel ? 'Fabric Color' : 'Product Color'}
                </h4>
                <span className="text-xs font-medium text-stone-800">{design.shirtColorName}</span>
              </div>

              <div className="grid grid-cols-5 gap-2.5">
                {availableColors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => onUpdateDesignGarment(design.garmentId, c.hex, c.name)}
                    className={`aspect-square rounded-xl border transition-all flex items-center justify-center ${
                      design.shirtColor.toLowerCase() === c.hex.toLowerCase()
                        ? 'ring-2 ring-stone-900 ring-offset-2 scale-105 shadow-sm'
                        : 'border-stone-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {design.shirtColor.toLowerCase() === c.hex.toLowerCase() && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          c.hex === '#FFFFFF' ? 'bg-stone-900' : 'bg-white'
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Custom Hex Color Picker */}
              <div className="mt-4 pt-3 flex items-center gap-3">
                <input
                  type="color"
                  value={design.shirtColor}
                  onChange={(e) =>
                    onUpdateDesignGarment(design.garmentId, e.target.value, 'Custom Tint')
                  }
                  className="w-8 h-8 rounded-lg cursor-pointer border border-stone-300 p-0.5"
                  title="Pick custom hex color"
                />
                <span className="text-xs text-stone-600 font-mono">{design.shirtColor}</span>
              </div>
            </div>

            {!isMobileCase && (
              <div className="pt-4 border-t border-stone-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Select {isApparel ? 'Size' : 'Variant'} ({selectedSize})
                  </h4>
                  {isApparel && onOpenSizeGuide && (
                    <button
                      onClick={onOpenSizeGuide}
                      className="text-[11px] font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1 hover:underline"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>Size Guide</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  {availableSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => onSelectSize?.(s)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        selectedSize === s
                          ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. MULTIPLE IMAGE UPLOAD TAB */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Upload Artwork or Logos
              </h4>
              <p className="text-[11px] text-stone-500 leading-relaxed mb-3">
                Upload multiple images simultaneously. PNG, transparent PNG, JPG, and WebP are supported.
              </p>

              {/* Drag & Drop Multi-file Area */}
              <label
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFileUpload(e.dataTransfer.files);
                }}
                className="border-2 border-dashed border-stone-300 hover:border-stone-500 bg-stone-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-stone-600 group-hover:text-stone-900 mb-2">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-stone-800">
                  Click or drag multiple files here
                </span>
                <span className="text-[10px] text-stone-400 mt-1">
                  PNG with transparency recommended · Max 15MB
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />
              </label>
            </div>

            {/* Uploaded Library & Quality Badges */}
            {uploadedFiles.length > 0 && (
              <div>
                <h5 className="text-xs font-bold text-stone-800 mb-2.5">
                  Uploaded Assets ({uploadedFiles.length})
                </h5>
                <div className="space-y-2">
                  {uploadedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-stone-200 bg-white flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden shrink-0 flex items-center justify-center">
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-stone-900 truncate">
                          {file.name}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-stone-400 mt-0.5">
                          <span>{file.width}×{file.height}px</span>
                          <span>·</span>
                          <span>{file.sizeKb} KB</span>
                        </div>
                        {/* Quality check indicator */}
                        <div className="mt-1 flex items-center gap-1">
                          {file.qualityScore === 'good' ? (
                            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              ✓ Good Print Quality
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              ⚠ Low Resolution Warning
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const aspect = file.width / file.height;
                          const fittedSize = fitArtworkToPrintArea(140, 140 / aspect);
                          onAddObject({
                            type: 'image',
                            imageUrl: file.url,
                            x: printCenterX,
                            y: printCenterY,
                            width: fittedSize.width,
                            height: fittedSize.height,
                            rotation: 0,
                            scaleX: 1,
                            scaleY: 1,
                            opacity: 1,
                            locked: false,
                            visible: true,
                            flipX: false,
                            flipY: false,
                            keepAspectRatio: true,
                            originalWidth: file.width,
                            originalHeight: file.height,
                          });
                          addToast('Added image to canvas', 'success');
                        }}
                        className="p-2 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-800 text-xs font-semibold shrink-0"
                        title="Add copy to canvas"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. TEXT CREATOR TAB */}
        {activeTab === 'text' && (
          <div className="space-y-5">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Custom Typography
              </h4>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text..."
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-900"
              />
            </div>

            {/* Font Family Selector */}
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                Typeface
              </label>
              <select
                value={textFont}
                onChange={(e) => setTextFont(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
              >
                <option value="Syne">Syne (Bold Architectural Display)</option>
                <option value="Plus Jakarta Sans">Plus Jakarta Sans (Clean Modern)</option>
                <option value="Bebas Neue">Bebas Neue (Heavy Streetwear Condensed)</option>
                <option value="Permanent Marker">Permanent Marker (Authentic Grunge)</option>
                <option value="Playfair Display">Playfair Display (Luxury Serif)</option>
                <option value="Space Grotesk">Space Grotesk (Neo-Brutalist Technical)</option>
              </select>
            </div>

            {/* Text Color */}
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                Font Color
              </label>
              <div className="flex items-center gap-2">
                {['#ffffff', '#171717', '#facc15', '#f43f5e', '#38bdf8', '#22c55e', '#a855f7'].map(
                  (hex) => (
                    <button
                      key={hex}
                      onClick={() => setTextColor(hex)}
                      className={`w-6 h-6 rounded-full border ${
                        textColor === hex ? 'ring-2 ring-stone-900 scale-110' : 'border-stone-300'
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  )
                )}
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-7 h-7 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Font Size Slider */}
            <div>
              <div className="flex items-center justify-between text-xs text-stone-700 mb-1">
                <span>Font Size</span>
                <span className="font-mono">{textSize}px</span>
              </div>
              <input
                type="range"
                min="12"
                max="60"
                value={textSize}
                onChange={(e) => setTextSize(Number(e.target.value))}
                className="w-full accent-stone-900"
              />
            </div>

            <button
              onClick={handleAddText}
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Add Text Element
            </button>
          </div>
        )}

        {/* 4. STICKERS & GRAPHICS TAB (10 CATEGORIES) */}
        {activeTab === 'stickers' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Vector Graphics Library
            </h4>

            {/* Categories horizontal pill bar */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {STICKER_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedStickerCat(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedStickerCat === cat
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sticker Grid for selected category */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {STICKER_LIBRARY.filter((s) => s.category === selectedStickerCat).map((st) => (
                <div
                  key={st.id}
                  onClick={() => handleAddSticker(st.svgDataUri, st.defaultWidth, st.defaultHeight)}
                  className="p-3 bg-stone-950 rounded-xl border border-stone-800 hover:border-amber-500 cursor-pointer transition-all flex flex-col items-center justify-between group shadow-2xs hover:scale-102"
                >
                  <div className="w-full aspect-square flex items-center justify-center p-2">
                    <img
                      src={st.svgDataUri}
                      alt={st.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-stone-400 group-hover:text-white mt-1 text-center truncate w-full">
                    {st.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. STARTER TEMPLATES PRESETS TAB */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
              Curated Design Templates
            </h4>
            <p className="text-[11px] text-stone-500 leading-relaxed mb-3">
              1-click ready concepts. Every graphic, text, and layer remains completely editable!
            </p>

            <div className="space-y-3">
              {STARTER_TEMPLATES.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() =>
                    onLoadTemplate({
                      ...tpl.design,
                      id: `design-${Date.now()}`,
                      createdAt: Date.now(),
                      updatedAt: Date.now(),
                    })
                  }
                  className="p-4 rounded-2xl border border-stone-200 bg-white hover:border-stone-900 cursor-pointer transition-all shadow-xs group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-amber-800 uppercase tracking-widest">
                        {tpl.category}
                      </span>
                      <h5 className="text-xs font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                        {tpl.name}
                      </h5>
                    </div>
                    <span
                      className="w-5 h-5 rounded-full border border-stone-300"
                      style={{ backgroundColor: tpl.previewColor }}
                    />
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Multi-view vector layout · Front & Back
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. LAYERS LIST TAB */}
        {activeTab === 'layers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                {activeView.toUpperCase()} Layers
              </h4>
              <span className="text-xs font-mono text-stone-400">
                {currentObjects.length} objects
              </span>
            </div>

            {currentObjects.length === 0 ? (
              <p className="text-xs text-stone-400 py-8 text-center italic">
                No artwork on this side yet. Upload an image or add text to start.
              </p>
            ) : (
              <div className="space-y-2">
                {/* Highest zIndex at the top */}
                {[...currentObjects]
                  .sort((a, b) => b.zIndex - a.zIndex)
                  .map((obj) => {
                    const isSelected = selectedIds.includes(obj.id);
                    return (
                      <div
                        key={obj.id}
                        onClick={() => setSelectedIds([obj.id])}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                            : 'border-stone-200 bg-white hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-[11px] font-mono text-stone-400">
                            #{obj.zIndex}
                          </span>
                          <span className="text-xs font-semibold text-stone-800 truncate">
                            {obj.type === 'text'
                              ? `Text: "${obj.text}"`
                              : `Image (${obj.width}×${obj.height})`}
                          </span>
                        </div>

                        {/* Layer Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          {/* Move Up */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onReorderObject(obj.id, 'up');
                            }}
                            className="p-1 text-stone-400 hover:text-stone-900 rounded"
                            title="Bring forward"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          {/* Move Down */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onReorderObject(obj.id, 'down');
                            }}
                            className="p-1 text-stone-400 hover:text-stone-900 rounded"
                            title="Send backward"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          {/* Visibility */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpdateObject(obj.id, {
                                visible: obj.visible === false ? true : false,
                              });
                            }}
                            className="p-1 text-stone-400 hover:text-stone-900 rounded"
                            title={obj.visible !== false ? 'Hide' : 'Show'}
                          >
                            {obj.visible !== false ? (
                              <Eye className="w-3.5 h-3.5" />
                            ) : (
                              <EyeOff className="w-3.5 h-3.5 text-stone-300" />
                            )}
                          </button>
                          {/* Lock */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpdateObject(obj.id, { locked: !obj.locked });
                            }}
                            className="p-1 text-stone-400 hover:text-stone-900 rounded"
                            title={obj.locked ? 'Unlock' : 'Lock'}
                          >
                            {obj.locked ? (
                              <Lock className="w-3.5 h-3.5 text-amber-600" />
                            ) : (
                              <Unlock className="w-3.5 h-3.5" />
                            )}
                          </button>
                          {/* Delete */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteObjects([obj.id]);
                            }}
                            className="p-1 text-stone-400 hover:text-rose-600 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
