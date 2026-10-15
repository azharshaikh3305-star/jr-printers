import Settings from '../models/Settings.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * @desc    Get store settings
 * @route   GET /api/settings
 * @access  Public
 */
export const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }

    return successResponse(res, 200, 'Settings retrieved', { settings });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update store settings
 * @route   PUT /api/settings
 * @access  Private / Admin
 */
export const updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      settings = await Settings.findByIdAndUpdate(settings._id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    return successResponse(res, 200, 'Store settings updated successfully', { settings });
  } catch (error) {
    next(error);
  }
};
