import Design from '../models/Design.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * @desc    Save custom studio canvas design
 * @route   POST /api/designs
 * @access  Public / Private
 */
export const saveDesign = async (req, res, next) => {
  try {
    const { title, garmentId, shirtColor, shirtColorName, views, thumbnailUrl, calculatedPrice } = req.body;

    if (!views || !garmentId) {
      return errorResponse(res, 400, 'Design must contain views and garment ID');
    }

    const design = await Design.create({
      user: req.user?._id || null,
      title: title || 'Untitled Custom Creation',
      garmentId,
      shirtColor: shirtColor || '#171717',
      shirtColorName: shirtColorName || 'Onyx Black',
      views,
      thumbnailUrl: thumbnailUrl || '',
      calculatedPrice: calculatedPrice || 999,
    });

    return successResponse(res, 201, 'Design saved to archive', { design });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user designs
 * @route   GET /api/designs
 * @access  Public / Private
 */
export const getUserDesigns = async (req, res, next) => {
  try {
    const query = req.user ? { user: req.user._id } : {};
    const designs = await Design.find(query).sort({ createdAt: -1 }).limit(30);

    return successResponse(res, 200, 'Designs retrieved', { designs });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete custom design
 * @route   DELETE /api/designs/:id
 * @access  Public / Private
 */
export const deleteDesign = async (req, res, next) => {
  try {
    const { id } = req.params;
    const design = await Design.findByIdAndDelete(id);

    if (!design) {
      return errorResponse(res, 404, 'Design not found');
    }

    return successResponse(res, 200, 'Design deleted from archive');
  } catch (error) {
    next(error);
  }
};
