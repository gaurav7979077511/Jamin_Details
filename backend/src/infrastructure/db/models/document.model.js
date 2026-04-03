import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    linkedTo: { type: String, enum: ['person', 'view'], required: true },
    linkedId: { type: String, required: true },
    url: { type: String, required: true },
    fileName: String
  },
  { timestamps: true }
);

export const DocumentModel = mongoose.model('Document', documentSchema);
