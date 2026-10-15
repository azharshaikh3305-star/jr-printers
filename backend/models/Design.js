import mongoose from 'mongoose';

const designSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    title: {
      type: String,
      required: true,
      default: 'Untitled Custom Creation',
      trim: true,
    },
    garmentId: {
      type: String,
      required: true,
      default: 'heavyweight-tee',
    },
    shirtColor: {
      type: String,
      default: '#171717',
    },
    shirtColorName: {
      type: String,
      default: 'Onyx Black',
    },
    views: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    calculatedPrice: {
      type: Number,
      default: 999,
    },
  },
  {
    timestamps: true,
  }
);

const Design = mongoose.models.Design || mongoose.model('Design', designSchema);
export default Design;
