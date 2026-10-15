import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Helper to find or create cart for user or guest session
 */
const getOrCreateCart = async (req) => {
  const userId = req.user?._id;
  const guestSessionId = req.headers['x-guest-session-id'] || 'default-guest-session';

  let cart = null;
  if (userId) {
    cart = await Cart.findOne({ user: userId });
  } else {
    cart = await Cart.findOne({ guestSessionId });
  }

  if (!cart) {
    cart = await Cart.create({
      user: userId || null,
      guestSessionId: !userId ? guestSessionId : null,
      items: [],
    });
  }

  return cart;
};

/**
 * @desc    Get current user or guest cart
 * @route   GET /api/cart
 * @access  Public / Optional Auth
 */
export const getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req);
    return successResponse(res, 200, 'Cart retrieved', { cart });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add item to cart
 * @route   POST /api/cart/items
 * @access  Public / Optional Auth
 */
export const addToCart = async (req, res, next) => {
  try {
    const {
      productId,
      name,
      price,
      quantity = 1,
      size = 'Standard',
      colorName = 'Standard',
      colorHex = '#18181b',
      garmentType = 'ceramic-cup',
      image = '',
      customDesign = null,
      printLocations = [],
    } = req.body;

    if (!productId || !name || price === undefined) {
      return errorResponse(res, 400, 'Please provide productId, name and price');
    }

    const cart = await getOrCreateCart(req);

    // Check if identical item already exists in cart
    const existingIndex = cart.items.findIndex(
      (item) =>
        item.productId === productId &&
        item.size === size &&
        item.colorName === colorName &&
        !item.customDesign &&
        !customDesign
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        productId,
        name,
        price: Number(price),
        quantity: Number(quantity),
        size,
        colorName,
        colorHex,
        garmentType,
        image,
        customDesign,
        printLocations,
      });
    }

    await cart.save();
    return successResponse(res, 200, 'Item added to cart', { cart });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart/items/:itemId
 * @access  Public / Optional Auth
 */
export const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return errorResponse(res, 400, 'Quantity must be at least 1');
    }

    const cart = await getOrCreateCart(req);
    const item = cart.items.id(itemId);

    if (!item) {
      return errorResponse(res, 404, 'Cart item not found');
    }

    item.quantity = Number(quantity);
    await cart.save();

    return successResponse(res, 200, 'Cart item updated', { cart });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/items/:itemId
 * @access  Public / Optional Auth
 */
export const removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const cart = await getOrCreateCart(req);

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    await cart.save();

    return successResponse(res, 200, 'Item removed from cart', { cart });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear entire cart
 * @route   DELETE /api/cart
 * @access  Public / Optional Auth
 */
export const clearCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req);
    cart.items = [];
    cart.couponCode = '';
    cart.discountPercent = 0;
    await cart.save();

    return successResponse(res, 200, 'Cart cleared', { cart });
  } catch (error) {
    next(error);
  }
};
