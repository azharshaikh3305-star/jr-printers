import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Please provide customer name'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide contact phone number'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      default: '',
    },
    subject: {
      type: String,
      required: [true, 'Please provide inquiry subject'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please provide message details'],
      trim: true,
    },
    preferredProduct: {
      type: String,
      default: 'General Printing',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Quoted', 'Closed'],
      default: 'New',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);
export default Inquiry;
