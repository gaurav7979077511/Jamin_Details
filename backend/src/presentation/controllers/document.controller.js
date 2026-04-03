import { DocumentModel } from '../../infrastructure/db/models/document.model.js';
import { writeAuditLog } from '../../application/services/audit.service.js';

export const uploadDocument = async (req, res) => {
  try {
    const { linkedTo, linkedId } = req.body;
    const doc = await DocumentModel.create({ linkedTo, linkedId, url: req.file.path, fileName: req.file.originalname });
    await writeAuditLog({ action: 'document.upload', userId: req.user.id, entityId: doc._id.toString(), entityType: 'Document', changes: { linkedTo, linkedId } });
    res.status(201).json(doc);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getDocument = async (req, res) => {
  const doc = await DocumentModel.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: 'Not found' });
  res.json(doc);
};
