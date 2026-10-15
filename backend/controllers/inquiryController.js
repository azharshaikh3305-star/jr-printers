import Inquiry from '../models/Inquiry.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * @desc    Submit a new customer inquiry / contact lead
 * @route   POST /api/inquiries
 * @access  Public
 */
export const createInquiry = async (req, res, next) => {
  try {
    const { customerName, phone, email, subject, message, preferredProduct } = req.body;

    if (!customerName || !phone || !message) {
      return errorResponse(res, 400, 'Please provide customer name, contact phone, and message');
    }

    const inquiry = await Inquiry.create({
      customerName,
      phone,
      email: email || '',
      subject: subject || `Inquiry for ${preferredProduct || 'Custom Printing'}`,
      message,
      preferredProduct: preferredProduct || 'General Printing',
      status: 'New',
    });

    return successResponse(res, 201, 'Inquiry submitted successfully! Shaikh Sameer will contact you on WhatsApp.', {
      inquiry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all inquiries / customer leads
 * @route   GET /api/inquiries
 * @access  Private / Admin
 */
export const getInquiries = async (req, res, next) => {
  try {
    const { status, search, limit = 50, page = 1 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search && search.trim()) {
      const q = search.trim();
      query.$or = [
        { customerName: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
        { subject: { $regex: q, $options: 'i' } },
        { message: { $regex: q, $options: 'i' } },
      ];
    }

    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);
    const skip = (parsedPage - 1) * parsedLimit;

    const [inquiries, totalCount] = await Promise.all([
      Inquiry.find(query).sort({ createdAt: -1 }).skip(skip).limit(parsedLimit),
      Inquiry.countDocuments(query),
    ]);

    return successResponse(res, 200, 'Inquiries retrieved', {
      inquiries,
      totalCount,
      page: parsedPage,
      totalPages: Math.ceil(totalCount / parsedLimit),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update inquiry status
 * @route   PATCH /api/inquiries/:id/status
 * @access  Private / Admin
 */
export const updateInquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return errorResponse(res, 404, 'Inquiry not found');
    }

    return successResponse(res, 200, `Lead marked as ${status}`, { inquiry });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete inquiry
 * @route   DELETE /api/inquiries/:id
 * @access  Private / Admin
 */
export const deleteInquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const inquiry = await Inquiry.findByIdAndDelete(id);

    if (!inquiry) {
      return errorResponse(res, 404, 'Inquiry not found');
    }

    return successResponse(res, 200, 'Inquiry deleted from database records');
  } catch (error) {
    next(error);
  }
};
