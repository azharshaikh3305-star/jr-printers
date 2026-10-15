import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { SAMPLE_PRODUCTS, GARMENT_COLORS, SIZES, JR_INFO } from '../../data/products';
import { ProductCard } from './ProductCard';
import { QuickViewModal } from './QuickViewModal';
import { Product } from '../../types';
import {
  SlidersHorizontal,
  X,
  Search,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  Phone,
  MessageSquare,
  ExternalLink,
  Headphones,
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { products, searchQuery, setSearchQuery, activeCategory, setActiveCategory } = useApp();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter States
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColorHex, setSelectedColorHex] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<string>('all'); // 'all', 'under25', '25to40', 'over40'
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('popular'); // 'popular', 'newest', 'price-asc', 'price-desc', 'rating'

  const categories = [
    { id: 'all', label: 'All Products (10)' },
    { id: 'custom', label: '👕 T-Shirt Printing' },
    { id: 'cups', label: '☕ Cup & Magic Mugs' },
    { id: 'pillows', label: '🛋️ Pillow Printing' },
    { id: 'bottles', label: '🍾 Bottle Printing' },
    { id: 'frames', label: '🖼️ Photo Frames' },
    { id: 'keychains', label: '🔑 Key Chain Printing' },
    { id: 'mobile-covers', label: '📱 Mobile Back Covers' },
  ];

  const materials = [
    { id: 'all', label: 'All Materials' },
    { id: 'combed', label: 'Combed Ring-Spun Cotton' },
    { id: 'supima', label: 'Supima Organic Cotton' },
    { id: 'french-terry', label: 'French Terry Loopback' },
    { id: 'vintage-dyed', label: 'Vintage Garment-Dyed' },
  ];

  const toggleSize = (s: string) => {
    setSelectedSizes((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
    );
  };

  // Reset size, color, material, price when active category changes so items are never hidden by apparel-only filters
  React.useEffect(() => {
    setSelectedSizes([]);
    setSelectedColorHex(null);
    setSelectedMaterial('all');
  }, [activeCategory]);

  const resetFilters = () => {
    setActiveCategory('all');
    setSelectedSizes([]);
    setSelectedColorHex(null);
    setPriceRange('all');
    setSelectedMaterial('all');
    setMinRating(0);
    setSearchQuery('');
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(query);
        const matchTag = product.tagline.toLowerCase().includes(query);
        const matchDesc = product.description.toLowerCase().includes(query);
        const matchMat = product.material.toLowerCase().includes(query);
        if (!matchName && !matchTag && !matchDesc && !matchMat) return false;
      }

      // Category matching with smart fallbacks
      if (activeCategory !== 'all') {
        if (activeCategory === 'custom' || activeCategory === 'tshirts') {
          const isApparel = ['custom', 'oversized', 'men', 'women', 'kids', 'hoodies'].includes(product.category) ||
            product.garmentType.includes('tee') || product.garmentType.includes('hoodie');
          if (!isApparel) return false;
        } else if (activeCategory === 'cups') {
          const isCup = product.category === 'cups' || product.garmentType === 'ceramic-cup' || product.name.toLowerCase().includes('mug') || product.name.toLowerCase().includes('cup');
          if (!isCup) return false;
        } else if (activeCategory === 'pillows') {
          const isPillow = product.category === 'pillows' || product.garmentType === 'photo-pillow' || product.name.toLowerCase().includes('pillow') || product.name.toLowerCase().includes('cushion');
          if (!isPillow) return false;
        } else if (activeCategory === 'bottles') {
          const isBottle = product.category === 'bottles' || product.garmentType === 'sipper-bottle' || product.name.toLowerCase().includes('bottle');
          if (!isBottle) return false;
        } else if (activeCategory === 'frames') {
          const isFrame = product.category === 'frames' || product.garmentType === 'photo-frame' || product.name.toLowerCase().includes('frame');
          if (!isFrame) return false;
        } else if (activeCategory === 'keychains') {
          const isKeychain = product.category === 'keychains' || product.garmentType === 'keychain' || product.name.toLowerCase().includes('key chain') || product.name.toLowerCase().includes('keychain');
          if (!isKeychain) return false;
        } else if (activeCategory === 'mobile-covers') {
          const isCase = product.category === 'mobile-covers' || product.garmentType === 'mobile-case' || product.name.toLowerCase().includes('case') || product.name.toLowerCase().includes('cover');
          if (!isCase) return false;
        } else if (product.category !== activeCategory) {
          return false;
        }
      }

      // Sizes
      if (selectedSizes.length > 0) {
        const hasSize = selectedSizes.some((s) => product.sizes.includes(s));
        if (!hasSize) return false;
      }

      // Color
      if (selectedColorHex) {
        const hasColor = product.colors.some(
          (c) => c.hex.toLowerCase() === selectedColorHex.toLowerCase()
        );
        if (!hasColor) return false;
      }

      // Price range
      if (priceRange === 'under799' && product.basePrice >= 799) return false;
      if (priceRange === '799to1499' && (product.basePrice < 799 || product.basePrice > 1499)) return false;
      if (priceRange === 'over1499' && product.basePrice <= 1499) return false;

      // Material
      if (selectedMaterial !== 'all') {
        if (!product.material.toLowerCase().includes(selectedMaterial)) return false;
      }

      // Rating
      if (minRating > 0 && product.rating < minRating) return false;

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        case 'price-asc':
          return a.basePrice - b.basePrice;
        case 'price-desc':
          return b.basePrice - a.basePrice;
        case 'rating':
          return b.rating - a.rating;
        case 'popular':
        default:
          return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      }
    });
  }, [searchQuery, activeCategory, selectedSizes, selectedColorHex, priceRange, selectedMaterial, minRating, sortBy]);

  const activeFilterCount =
    (activeCategory !== 'all' ? 1 : 0) +
    selectedSizes.length +
    (selectedColorHex ? 1 : 0) +
    (priceRange !== 'all' ? 1 : 0) +
    (selectedMaterial !== 'all' ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* JR PRINTING WORKS BANNER HEADER */}
        <div className="mb-8 rounded-3xl overflow-hidden bg-gradient-to-r from-[#2B0411] via-[#48081E] to-[#20020B] border border-rose-900/60 shadow-xl text-white p-6 sm:p-8 relative">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-400 text-stone-950 font-black text-2xl sm:text-3xl flex items-center justify-center font-display shadow-lg border border-amber-300 shrink-0">
                JR
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-3xl font-display font-black tracking-tight uppercase text-white">
                    JR PRINTING WORKS
                  </span>
                  <span className="text-xs font-bold text-amber-400 bg-black/40 px-2 py-0.5 rounded-full border border-amber-400/40">
                    Pro. Shaikh Sameer
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-amber-200 mt-1 max-w-xl">
                  T Shirt Printing, Cup Printing, Pillow Printing, Bottle Printing, Key Chain Printing, Photo Frame Printing & Mobile Covers
                </p>
              </div>
            </div>

            {/* Direct WhatsApp Callouts */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
              <a
                href={JR_INFO.whatsapp1Link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl transition-all shadow-sm font-mono"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-white" />
                <span>WhatsApp: {JR_INFO.phone1}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={JR_INFO.whatsapp2Link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 px-4 py-2 rounded-xl transition-all shadow-sm font-mono font-bold"
              >
                <Phone className="w-3.5 h-3.5 fill-stone-950" />
                <span>Sameer: {JR_INFO.phone2}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Quick Category Filter Pills inside Banner */}
          <div className="mt-6 pt-5 border-t border-rose-900/60 flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  activeCategory === c.id
                    ? 'bg-amber-400 text-stone-950 shadow-sm'
                    : 'bg-black/40 text-stone-200 hover:bg-black/60 hover:text-white border border-rose-900/60'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Control Bar: Search, Category Quick Bar, Sort, Filter Trigger */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search bar inside collection */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search garments, 280 GSM, oversized..."
              className="w-full pl-10 pr-9 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-900 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right actions: Filter count button (mobile & desktop) and Sort selector */}
          <div className="flex items-center gap-3 justify-between md:justify-end">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-800 hover:bg-stone-50 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-600" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-stone-900 text-white font-mono text-[10px] flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 hidden sm:block" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:border-stone-900 cursor-pointer"
              >
                <option value="popular">Sort: Best Sellers</option>
                <option value="newest">Sort: Newest Cuts</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Layout: Left Filter Sidebar (Desktop) + Right Product Grid */}
        <div className="flex items-start gap-8">
          {/* Desktop Left Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h3 className="font-display font-bold text-sm text-stone-900">Filter By</h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
                Category
              </h4>
              <div className="space-y-1 text-xs">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCategory(c.id)}
                    className={`w-full text-left py-1.5 px-2 rounded-lg transition-colors flex items-center justify-between ${
                      activeCategory === c.id
                        ? 'bg-stone-900 text-white font-semibold'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="pt-4 border-t border-stone-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
                Price
              </h4>
              <div className="space-y-1.5 text-xs text-stone-700">
                {[
                  { id: 'all', label: 'All Prices' },
                  { id: 'under799', label: 'Under ₹799' },
                  { id: '799to1499', label: '₹799 to ₹1,499' },
                  { id: 'over1499', label: 'Over ₹1,499' },
                ].map((p) => (
                  <label key={p.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={priceRange === p.id}
                      onChange={() => setPriceRange(p.id)}
                      className="accent-stone-900"
                    />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sizes Filter */}
            <div className="pt-4 border-t border-stone-100">
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Size {selectedSizes.length > 0 ? `(${selectedSizes.length})` : ''}
                </h4>
                {selectedSizes.length > 0 && (
                  <button
                    onClick={() => setSelectedSizes([])}
                    className="text-[10px] text-amber-800 font-semibold hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSize(s)}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      selectedSizes.includes(s)
                        ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Swatches Filter */}
            <div className="pt-4 border-t border-stone-100">
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Color
                </h4>
                {selectedColorHex && (
                  <button
                    onClick={() => setSelectedColorHex(null)}
                    className="text-[10px] text-amber-700 font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {GARMENT_COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() =>
                      setSelectedColorHex(
                        selectedColorHex === c.hex ? null : c.hex
                      )
                    }
                    className={`w-6 h-6 rounded-full border transition-all ${
                      selectedColorHex === c.hex
                        ? 'ring-2 ring-stone-900 ring-offset-2 scale-110'
                        : 'border-stone-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Material Filter */}
            <div className="pt-4 border-t border-stone-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
                Material & Finish
              </h4>
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 text-stone-800 text-xs px-2.5 py-2 rounded-lg"
              >
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1 min-w-0">
            {/* Active Filters Row (if any) */}
            {activeFilterCount > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-stone-400">Active filters:</span>
                {activeCategory !== 'all' && (
                  <span className="bg-stone-200 text-stone-800 px-2.5 py-1 rounded-md flex items-center gap-1 font-medium">
                    {categories.find((c) => c.id === activeCategory)?.label}
                    <button onClick={() => setActiveCategory('all')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedSizes.map((s) => (
                  <span
                    key={s}
                    className="bg-stone-200 text-stone-800 px-2.5 py-1 rounded-md flex items-center gap-1 font-medium"
                  >
                    Size: {s}
                    <button onClick={() => toggleSize(s)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {selectedColorHex && (
                  <span className="bg-stone-200 text-stone-800 px-2.5 py-1 rounded-md flex items-center gap-1 font-medium">
                    Color
                    <span
                      className="w-2.5 h-2.5 rounded-full ml-1"
                      style={{ backgroundColor: selectedColorHex }}
                    />
                    <button onClick={() => setSelectedColorHex(null)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={resetFilters}
                  className="text-amber-800 font-semibold underline underline-offset-2 ml-2"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Results Count & Active Category Badge */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 font-medium">
              <div className="flex items-center gap-2">
                <span>Showing</span>
                <span className="font-bold text-stone-900">{filteredProducts.length} items</span>
                {activeCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[11px] border border-amber-300">
                    <span>
                      {categories.find((c) => c.id === activeCategory)?.label || activeCategory}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveCategory('all')}
                      title="Clear category filter"
                      className="hover:text-stone-950 p-0.5 rounded-full hover:bg-amber-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>

            {/* Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto my-8">
                <Sparkles className="w-8 h-8 text-stone-400 mx-auto mb-3" />
                <h3 className="font-display font-bold text-base text-stone-900">No matching garments found</h3>
                <p className="text-xs text-stone-500 mt-1">
                  Try adjusting or clearing your filters to explore our full apparel archive.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Bottom Sheet / Modal */}
      {mobileFiltersOpen && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setMobileFiltersOpen(false)}
        >
          <div
            className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl max-h-[85vh] overflow-y-auto p-6 shadow-2xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <h3 className="font-display font-bold text-base text-stone-900">Filters</h3>
                <button onClick={() => setMobileFiltersOpen(false)}>
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>

              {/* Categories */}
              <div className="py-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Category
                </h4>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setActiveCategory(c.id)}
                      className={`py-2 px-3 rounded-lg text-left transition-colors ${
                        activeCategory === c.id
                          ? 'bg-stone-900 text-white font-semibold'
                          : 'bg-stone-50 text-stone-700'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="py-4 border-t border-stone-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Size {selectedSizes.length > 0 ? `(${selectedSizes.length})` : ''}
                  </h4>
                  {selectedSizes.length > 0 && (
                    <button
                      onClick={() => setSelectedSizes([])}
                      className="text-[10px] text-amber-800 font-semibold"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleSize(s)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        selectedSizes.includes(s)
                          ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div className="py-4 border-t border-stone-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Color
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {GARMENT_COLORS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() =>
                        setSelectedColorHex(selectedColorHex === c.hex ? null : c.hex)
                      }
                      className={`w-7 h-7 rounded-full border ${
                        selectedColorHex === c.hex
                          ? 'ring-2 ring-stone-900 ring-offset-2 scale-110'
                          : 'border-stone-300'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={resetFilters}
                className="py-3 bg-stone-100 text-stone-800 text-xs font-bold rounded-xl"
              >
                Reset All
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="py-3 bg-stone-900 text-white text-xs font-bold rounded-xl"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
};
