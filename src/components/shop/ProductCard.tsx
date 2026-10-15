import React, { useState } from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { Heart, Star, Palette, ShoppingBag, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { navigateTo, startCustomizingProduct, addToCart, wishlist, toggleWishlist, addToast } = useApp();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [isHovered, setIsHovered] = useState(false);

  const isWishlisted = wishlist.includes(product.id);

  const displayImage = isHovered && product.images[1] ? product.images[1] : product.images[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: `cart-${product.id}-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      garmentType: product.garmentType,
      colorName: selectedColor.name,
      colorHex: selectedColor.hex,
      size: product.sizes[1] || 'M',
      quantity: 1,
      unitPrice: product.basePrice,
      totalPrice: product.basePrice,
      printLocations: ['Standard Plain Blank'],
    });
  };

  const handleCustomize = (e: React.MouseEvent) => {
    e.stopPropagation();
    startCustomizingProduct(product, selectedColor.hex);
  };

  return (
    <div
      onClick={() => navigateTo('product-detail', { productId: product.id })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer flex flex-col bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 relative"
    >
      {/* Visual Image Container with 4:3 Aspect Ratio */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        <img
          src={displayImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500"
          onError={(e) => {
            // Elegant CSS/SVG fallback container if image fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Fallback pattern underneath */}
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-stone-100 to-stone-200 flex items-center justify-center text-stone-400">
          <Palette className="w-8 h-8 opacity-40" />
        </div>

        {/* Top Badges: Discount & Best Seller */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.isBestSeller && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-sm">
              Best Seller
            </span>
          )}
          {product.discountPercent && (
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-sm">
              Save {product.discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-sm'
              : 'bg-white/80 text-stone-600 hover:text-stone-900 hover:bg-white shadow-xs'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Floating Quick Action Overlay on Desktop */}
        <div className="absolute inset-x-3 bottom-3 hidden sm:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {onQuickView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="flex-1 bg-white/95 text-stone-900 text-xs font-semibold py-2 px-3 rounded-lg shadow-sm hover:bg-white transition-colors flex items-center justify-center gap-1.5 backdrop-blur-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              Quick View
            </button>
          )}

          <button
            onClick={handleCustomize}
            className="flex-1 bg-stone-900/95 text-white text-xs font-semibold py-2 px-3 rounded-lg shadow-sm hover:bg-stone-900 transition-colors flex items-center justify-center gap-1.5 backdrop-blur-xs"
          >
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            Customize
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Line */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="uppercase tracking-wider text-[11px] font-medium text-stone-400">
              {product.weightGsm} GSM Cotton
            </span>
            <div className="flex items-center gap-1 text-stone-700">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-xs">{product.rating}</span>
              <span className="text-stone-400 text-[11px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-semibold text-stone-900 text-sm sm:text-base group-hover:text-amber-800 transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-stone-500 mt-1 line-clamp-1">
            {product.tagline}
          </p>
        </div>

        {/* Footer Area: Price & Color Swatches */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          {/* Price */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-bold font-mono text-stone-900 tabular-nums">
              ₹{product.basePrice}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-stone-400 line-through font-mono tabular-nums">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          {/* Color Swatches */}
          <div className="flex items-center gap-1.5">
            {product.colors.slice(0, 4).map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColor(c);
                }}
                title={c.name}
                className={`w-4 h-4 rounded-full border transition-all ${
                  selectedColor.name === c.name
                    ? 'ring-2 ring-stone-900 ring-offset-1 scale-110'
                    : 'border-stone-300 hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-stone-400 font-mono">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Mobile Action Buttons (Directly visible on mobile) */}
        <div className="mt-3 pt-2 grid grid-cols-2 gap-2 sm:hidden">
          <button
            onClick={handleQuickAdd}
            className="w-full text-xs font-semibold py-2 px-2 bg-stone-100 text-stone-800 rounded-lg hover:bg-stone-200 transition-colors flex items-center justify-center gap-1"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Buy Plain
          </button>
          <button
            onClick={handleCustomize}
            className="w-full text-xs font-semibold py-2 px-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors flex items-center justify-center gap-1"
          >
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            Design
          </button>
        </div>
      </div>
    </div>
  );
};
