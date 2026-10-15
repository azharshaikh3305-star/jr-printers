import Product from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * @desc    Get all products with filtering, search, and sorting
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res, next) => {
  try {
    const { category, search, inStock, sort, limit = 50, page = 1 } = req.query;

    const query = {};

    // Filter by category
    if (category && category !== 'all') {
      if (category === 'tshirts') {
        query.category = { $in: ['custom', 'oversized', 'hoodies', 'men', 'women'] };
      } else {
        query.category = category;
      }
    }

    // Filter by stock
    if (inStock !== undefined) {
      query.inStock = inStock === 'true';
    }

    // Search query
    if (search && search.trim()) {
      const q = search.trim();
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { tagline: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { basePrice: 1 };
    if (sort === 'price-desc') sortOption = { basePrice: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'bestseller') sortOption = { isBestSeller: -1, rating: -1 };

    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);
    const skip = (parsedPage - 1) * parsedLimit;

    const [products, totalCount] = await Promise.all([
      Product.find(query).sort(sortOption).skip(skip).limit(parsedLimit),
      Product.countDocuments(query),
    ]);

    return successResponse(res, 200, 'Products retrieved successfully', {
      products,
      totalCount,
      page: parsedPage,
      totalPages: Math.ceil(totalCount / parsedLimit),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Search by ObjectId or custom id
    let product;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }

    if (!product) {
      // Fallback search by custom id field or regex
      product = await Product.findOne({
        $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { name: { $regex: id, $options: 'i' } }],
      });
    }

    if (!product) {
      return errorResponse(res, 404, 'Product not found');
    }

    return successResponse(res, 200, 'Product details retrieved', { product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      tagline,
      description,
      category,
      basePrice,
      originalPrice,
      discountPercent,
      images,
      colors,
      sizes,
      material,
      weightGsm,
      inStock = true,
      isBestSeller = false,
      isNewArrival = true,
      garmentType,
      features,
    } = req.body;

    if (!name || !category || basePrice === undefined) {
      return errorResponse(res, 400, 'Please provide product name, category, and base price');
    }

    const productImages = Array.isArray(images) && images.length > 0
      ? images
      : ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=900'];

    const newProduct = await Product.create({
      name,
      tagline: tagline || '',
      description: description || '',
      category,
      basePrice: Number(basePrice),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      discountPercent: discountPercent ? Number(discountPercent) : 0,
      images: productImages,
      colors: colors || [],
      sizes: sizes || ['Standard'],
      material: material || 'Premium Sublimation Substrate',
      weightGsm: weightGsm ? Number(weightGsm) : 240,
      inStock: inStock !== false,
      isBestSeller: !!isBestSeller,
      isNewArrival: !!isNewArrival,
      garmentType: garmentType || 'ceramic-cup',
      features: features || [],
    });

    return successResponse(res, 201, `Product "${newProduct.name}" created successfully`, {
      product: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update existing product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return errorResponse(res, 404, 'Product not found');
    }

    const updated = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    return successResponse(res, 200, 'Product updated successfully', { product: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return errorResponse(res, 404, 'Product not found');
    }

    await Product.findByIdAndDelete(id);

    return successResponse(res, 200, `Product "${product.name}" deleted from catalog`);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all product categories with count
 * @route   GET /api/categories
 * @access  Public
 */
export const getCategories = async (req, res, next) => {
  try {
    const categoriesMeta = [
      { id: 'all', name: 'All Products', icon: '✨' },
      { id: 'custom', name: 'T-Shirt Printing', icon: '👕' },
      { id: 'cups', name: 'Cups & Magic Mugs', icon: '☕' },
      { id: 'pillows', name: 'Photo Cushions & Pillows', icon: '🛋️' },
      { id: 'bottles', name: 'Sipper & Sports Bottles', icon: '🍾' },
      { id: 'frames', name: 'Photo Frames & Collages', icon: '🖼️' },
      { id: 'keychains', name: 'Keychains & Accessories', icon: '🔑' },
      { id: 'mobile-covers', name: 'Mobile Back Covers', icon: '📱' },
    ];

    const counts = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    counts.forEach((c) => {
      countMap[c._id] = c.count;
    });

    const categories = categoriesMeta.map((cat) => ({
      ...cat,
      count: cat.id === 'all' ? Object.values(countMap).reduce((a, b) => a + b, 0) : countMap[cat.id] || 0,
    }));

    return successResponse(res, 200, 'Categories retrieved', { categories });
  } catch (error) {
    next(error);
  }
};
