import mongoose from 'mongoose';

const landViewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    khataNo: String,
    plotNo: String,
    totalRakba: { type: Number, required: true }
  },
  { timestamps: true }
);

export const LandViewModel = mongoose.model('LandView', landViewSchema);
