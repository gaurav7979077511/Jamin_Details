import mongoose from 'mongoose';

const distributionSchema = new mongoose.Schema(
  {
    personId: { type: String, required: true, index: true },
    viewId: { type: String, required: true, index: true },
    rakba: { type: Number, required: true, default: 0 },
    isManual: { type: Boolean, default: false }
  },
  { timestamps: true }
);

distributionSchema.index({ personId: 1, viewId: 1 }, { unique: true });

export const DistributionModel = mongoose.model('Distribution', distributionSchema);
