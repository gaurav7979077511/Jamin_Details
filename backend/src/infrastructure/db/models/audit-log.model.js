import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  userId: { type: String, required: true },
  entityId: { type: String, required: true },
  entityType: { type: String, required: true },
  changes: { type: mongoose.Schema.Types.Mixed, required: true },
  timestamp: { type: Date, default: Date.now }
});

export const AuditLogModel = mongoose.model('AuditLog', auditLogSchema);
