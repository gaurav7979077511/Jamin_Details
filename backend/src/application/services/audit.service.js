import { AuditLogModel } from '../../infrastructure/db/models/audit-log.model.js';

export const writeAuditLog = async ({ action, userId, entityId, entityType, changes }) => {
  await AuditLogModel.create({ action, userId, entityId, entityType, changes });
};
