import mongoose from 'mongoose';

const personSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    hindiName: { type: String },
    isLate: { type: Boolean, default: false },
    isRoot: { type: Boolean, default: false },
    parentId: { type: String, default: null },
    childrenIds: [{ type: String }],
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const PersonModel = mongoose.model('Person', personSchema);
