import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Product, GarmentType } from '../../../types';
import { PRODUCT_IMAGES, GARMENT_COLORS, SIZES } from '../../../data/products';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Tag,
  ShoppingBag,
  ExternalLink,
  Layers,
  Sparkles,
  Eye,
} from 'lucide-react';

interface AdminProductsTabProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

export const AdminProductsTab: React.FC<AdminProductsTabProps> = ({
  isAddModalOpen,
  setIsAddModalOpen,
}) => {
  const { products, addProduct, updateProduct, deleteProduct, navigateTo, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Form State for Adding / Editing Product
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    category: 'custom' as Product['category'],
    basePrice: 499,
    originalPrice: 699,
    discountPercent: 28,
    inStock: true,
    isBestSeller: false,
    isNewArrival: true,
    material: 'Premium Sublimation Substrate',
    weightGsm: 240,
    imageUrl: PRODUCT_IMAGES.mugsCups,
    garmentType: 'ceramic-cup' as GarmentType,
    features: ['High-resolution 300 DPI sublimation printing', 'Glossy durable finish', 'Fast 48-hour dispatch'],
  });

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchTag = (p.tagline || '').toLowerCase().includes(q);
        const matchCat = (p.category || '').toLowerCase().includes(q);
        if (!matchName && !matchTag && !matchCat) return false;
      }
      if (categoryFilter !== 'all') {
        if (categoryFilter === 'tshirts' && (p.category === 'custom' || p.category === 'oversized' || p.category === 'hoodies')) {
          return true;
        }
        return p.category === categoryFilter;
      }
      return true;
    });
  }, [products, searchQuery, categoryFilter]);

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      tagline: '',
      description: '',
      category: 'cups',
      basePrice: 349,
      originalPrice: 499,
      discountPercent: 30,
      inStock: true,
      isBestSeller: false,
      isNewArrival: true,
      material: 'Ceramic Grade A High-Gloss',
      weightGsm: 330,
      imageUrl: PRODUCT_IMAGES.mugsCups,
      garmentType: 'ceramic-cup',
      features: ['Photo reveal with hot beverage', 'Microwave safe ceramic', 'Edge to edge wrap print'],
    });
    setEditingProduct(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      tagline: p.tagline,
      description: p.description,
      category: p.category,
      basePrice: p.basePrice,
      originalPrice: p.originalPrice || Math.round(p.basePrice * 1.3),
      discountPercent: p.discountPercent || 25,
      inStock: p.inStock,
      isBestSeller: !!p.isBestSeller,
      isNewArrival: !!p.isNewArrival,
      material: p.material,
      weightGsm: p.weightGsm,
      imageUrl: p.images[0] || PRODUCT_IMAGES.heroModel,
      garmentType: p.garmentType,
      features: p.features || [],
    });
    setIsAddModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Please enter product name', 'error');
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formData.name.trim(),
        tagline: formData.tagline.trim(),
        description: formData.description.trim(),
        category: formData.category,
        basePrice: Number(formData.basePrice),
        originalPrice: Number(formData.originalPrice),
        discountPercent: Number(formData.discountPercent),
        inStock: formData.inStock,
        isBestSeller: formData.isBestSeller,
        isNewArrival: formData.isNewArrival,
        material: formData.material,
        weightGsm: Number(formData.weightGsm),
        images: [formData.imageUrl, ...(editingProduct.images.slice(1) || [])],
        features: formData.features,
      });
    } else {
      addProduct({
        name: formData.name.trim(),
        tagline: formData.tagline.trim() || 'Customized with your photos',
        description: formData.description.trim() || 'High quality customized photo printing with vibrant colors.',
        category: formData.category,
        basePrice: Number(formData.basePrice),
        originalPrice: Number(formData.originalPrice),
        discountPercent: Number(formData.discountPercent),
        inStock: formData.inStock,
        isBestSeller: formData.isBestSeller,
        isNewArrival: formData.isNewArrival,
        images: [formData.imageUrl],
        colors: GARMENT_COLORS.slice(0, 4),
        sizes: [...SIZES],
        material: formData.material,
        weightGsm: Number(formData.weightGsm),
        rating: 5.0,
        reviewCount: 1,
        garmentType: formData.garmentType,
        features: formData.features,
      });
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-display font-black text-stone-900 uppercase">
              Store Catalog Management
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 font-mono">
              {products.length} Items Live
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage real prices, stock status, descriptions, and publish new products to your live shop
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 outline-none focus:border-stone-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm shrink-0 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Category Filter Badges */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold no-scrollbar">
        {[
          { id: 'all', label: 'All Products' },
          { id: 'custom', label: '👕 T-Shirts' },
          { id: 'cups', label: '☕ Cups & Mugs' },
          { id: 'pillows', label: '🛋️ Pillows' },
          { id: 'bottles', label: '🍾 Bottles' },
          { id: 'frames', label: '🖼️ Photo Frames' },
          { id: 'keychains', label: '🔑 Keychains' },
          { id: 'mobile-covers', label: '📱 Mobile Covers' },
        ].map((cat) => {
          const isSelected = categoryFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                isSelected
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Products Grid (Responsive for all screens) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-3xl p-4 border border-stone-200 shadow-xs hover:border-amber-400 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Product Image & Badges */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-stone-100 mb-3 border border-stone-200">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      p.inStock
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-rose-600 text-white shadow-xs'
                    }`}
                  >
                    {p.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                  {p.isBestSeller && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-400 text-stone-950 shadow-xs">
                      Bestseller
                    </span>
                  )}
                  {p.isNewArrival && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-900 text-white shadow-xs">
                      New
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                  {p.category}
                </div>
              </div>

              {/* Product Info */}
              <h3 className="font-display font-black text-stone-900 text-sm leading-tight line-clamp-1">
                {p.name}
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-2 leading-relaxed">
                {p.tagline}
              </p>

              {/* Price Row */}
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="font-display font-black text-stone-900 text-base">
                  ₹{p.basePrice}
                </span>
                {p.originalPrice && (
                  <span className="text-xs text-stone-400 line-through">
                    ₹{p.originalPrice}
                  </span>
                )}
                {p.discountPercent && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {p.discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
              <button
                onClick={() => updateProduct(p.id, { inStock: !p.inStock })}
                className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-colors ${
                  p.inStock
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    : 'border-rose-300 bg-rose-50 text-rose-800 hover:bg-rose-100'
                }`}
                title="Toggle stock status"
              >
                {p.inStock ? '✓ In Stock' : '✕ Out Stock'}
              </button>

              <button
                onClick={() => handleOpenEditModal(p)}
                className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
                title="Edit Product"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setProductToDelete(p)}
                className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                title="Delete Product"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* In-App Delete Confirmation Modal (No window.confirm) */}
      {productToDelete && (
        <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-display font-black text-base text-stone-900">
                Delete "{productToDelete.name}"?
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                This item will be removed from your customer storefront immediately.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteProduct(productToDelete.id);
                  setProductToDelete(null);
                }}
                className="py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-display font-black text-base text-stone-900 uppercase">
                {editingProduct ? 'Edit Catalog Product' : 'Add New Print Product'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Magic Color Reveal Ceramic Mug"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-stone-900 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Store Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as Product['category'],
                      })
                    }
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-stone-900 font-semibold"
                  >
                    <option value="custom">👕 T-Shirt Printing</option>
                    <option value="cups">☕ Cup & Magic Mug Printing</option>
                    <option value="pillows">🛋️ Pillow Printing</option>
                    <option value="bottles">🍾 Bottle Printing</option>
                    <option value="frames">🖼️ Photo Frame Printing</option>
                    <option value="keychains">🔑 Key Chain Printing</option>
                    <option value="mobile-covers">📱 Mobile Back Covers</option>
                    <option value="oversized">Oversized Streetwear</option>
                    <option value="hoodies">Hoodies</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Base Sale Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.basePrice}
                    onChange={(e) =>
                      setFormData({ ...formData, basePrice: Number(e.target.value) })
                    }
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-stone-900 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Original Price (₹) (MRP)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, originalPrice: Number(e.target.value) })
                    }
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Stock Availability
                  </label>
                  <select
                    value={formData.inStock ? 'true' : 'false'}
                    onChange={(e) =>
                      setFormData({ ...formData, inStock: e.target.value === 'true' })
                    }
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-stone-900 font-semibold"
                  >
                    <option value="true">In Stock (Available for orders)</option>
                    <option value="false">Out of Stock (Temporarily unavailable)</option>
                  </select>
                </div>
              </div>

              {/* Bestseller & New Arrival Checkboxes */}
              <div className="flex items-center gap-6 py-1">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) =>
                      setFormData({ ...formData, isBestSeller: e.target.checked })
                    }
                    className="rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span>Mark as Bestseller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) =>
                      setFormData({ ...formData, isNewArrival: e.target.checked })
                    }
                    className="rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span>Mark as New Arrival</span>
                </label>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Tagline / Catchphrase
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Hot Water Reveal & High-Gloss Ceramic"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Full Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe material, print specs, sizing and care instructions..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-stone-900"
                />
              </div>

              {/* Image Selection Presets */}
              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Product Image URL or Quick Presets
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="Paste Image URL or select from studio assets below"
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-stone-900 font-mono text-[11px] mb-2"
                />

                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {[
                    { label: 'Magic Mug', url: PRODUCT_IMAGES.mugsCups },
                    { label: 'Photo Pillow', url: PRODUCT_IMAGES.pillows },
                    { label: 'Bottle', url: PRODUCT_IMAGES.bottlesGifts },
                    { label: 'Photo Frame', url: PRODUCT_IMAGES.photoFrames },
                    { label: 'T-Shirt', url: PRODUCT_IMAGES.heroModel },
                    { label: 'Hoodie', url: PRODUCT_IMAGES.hoodieSand },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                      className={`flex items-center gap-1.5 p-1 rounded-lg border text-[11px] font-semibold shrink-0 transition-colors ${
                        formData.imageUrl === preset.url
                          ? 'border-amber-500 bg-amber-50 text-amber-900'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-6 h-6 rounded object-cover"
                      />
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  {editingProduct ? 'Save Product Changes' : 'Create & Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
