import { LandViewModel } from '../../infrastructure/db/models/land-view.model.js';
import { writeAuditLog } from './audit.service.js';

export const createView = async (payload, user) => {
  const view = await LandViewModel.create(payload);
  await writeAuditLog({ action: 'view.create', userId: user.id, entityId: view._id.toString(), entityType: 'LandView', changes: payload });
  return view;
};

export const listViews = () => LandViewModel.find().lean();
export const getView = (id) => LandViewModel.findById(id).lean();
