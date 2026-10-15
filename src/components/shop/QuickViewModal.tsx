import React, { useState } from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { JR_INFO } from '../../data/products';
import { X, Star, ShoppingBag, Palette, Check, ArrowRight, MessageSquare } from 'lucide-react';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart, startCustomizingProduct, navigateTo } = useApp();
  const [selectedColor, setSelectedColor] = useState(product ? product.colors[0] : null);
  const [selectedSize, setSelectedSize] = useState(product ? product.sizes[1] || product.sizes[0] : 'M');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!product) return null;

  const currentColor = selectedColor || product.colors[0];

  const handleAddToCart = () => {
    addToCart({
      id: `cart-${product.id}-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      garmentType: product.garmentType,
      colorName: currentColor.name,
      colorHex: currentColor.hex,
      size: selectedSize,
      quantity,
      unitPrice: product.basePrice,
      totalPrice: product.basePrice * quantity,
      printLocations: ['Standard Plain Garment'],
    });
    onClose();
  };

  const handleCustomize = () => {
    onClose();
    startCustomizingProduct(product, currentColor.hex);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col md:flex-row max-h-[90vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-stone-500 hover:text-stone-900 bg-white/80 backdrop-blur-md rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Gallery */}
        <div className="w-full md:w-1/2 bg-stone-100 p-6 flex flex-col items-center justify-between">
          <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden bg-white shadow-xs">
            <img
              src={product.images[activeImageIdx] || product.images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIdx(i)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImageIdx === i ? 'border-stone-900 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Controls */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-1.5 text-stone-500 text-xs mb-1">
              <span>{product.material}</span>
              <span>·</span>
              <span className="font-mono">{product.weightGsm} GSM</span>
            </div>

            <h2 className="text-xl font-bold text-stone-900 font-display">{product.name}</h2>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="ml-1 text-xs font-semibold text-stone-900">{product.rating}</span>
              </div>
              <span className="text-stone-300">|</span>
              <span className="text-xs text-stone-500">{product.reviewCount} verified reviews</span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-stone-900">₹{product.basePrice}</span>
              {product.originalPrice && (
                <span className="text-sm text-stone-400 line-through font-mono">₹{product.originalPrice}</span>
              )}
            </div>

            {/* Color selection */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-stone-800">Color:</span>
                <span className="text-stone-500">{currentColor.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    className={`w-6 h-6 rounded-full border transition-all ${
                      currentColor.name === c.name
                        ? 'ring-2 ring-stone-900 ring-offset-2 scale-110'
                        : 'border-stone-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Size selection */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-stone-800">
                  Select Size: <strong className="text-stone-900">{selectedSize}</strong>
                </span>
                <span className="text-stone-500 text-[11px] font-medium">XXS to 6XL Available</span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      selectedSize === s
                        ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 pt-4 border-t border-stone-100 flex flex-col gap-2.5">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleAddToCart}
                className="w-full bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Add Blank (₹{product.basePrice * quantity})
              </button>
              <button
                onClick={handleCustomize}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Palette className="w-4 h-4 text-amber-400" />
                Customize
              </button>
            </div>

            <a
              href={`https://wa.me/917888162822?text=Hello%20JR%20Printing%20Works%2C%20I%20want%20to%20order%20${encodeURIComponent(product.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-2xs font-mono"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Direct WhatsApp Order: {JR_INFO.phone1}</span>
            </a>

            <button
              onClick={() => {
                onClose();
                navigateTo('product-detail', { productId: product.id });
              }}
              className="text-stone-500 hover:text-stone-900 text-xs text-center py-1 transition-colors flex items-center justify-center gap-1"
            >
              <span>View full product specifications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
