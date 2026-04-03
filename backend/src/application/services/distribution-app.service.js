import { DistributionModel } from '../../infrastructure/db/models/distribution.model.js';
import { PersonModel } from '../../infrastructure/db/models/person.model.js';
import { LandViewModel } from '../../infrastructure/db/models/land-view.model.js';
import { recalculateTree } from '../../domain/services/distribution.service.js';
import { writeAuditLog } from './audit.service.js';

const toRecords = (allocations, viewId) => Object.entries(allocations).map(([personId, rakba]) => ({ personId, viewId, rakba, isManual: false }));

export const previewDistribution = async (viewId) => {
  const view = await LandViewModel.findById(viewId);
  if (!view) throw new Error('View not found');
  const people = await PersonModel.find({ isDeleted: false }).lean();
  const root = people.find((p) => p.isRoot);
  if (!root) throw new Error('Root not found');
  const allocations = recalculateTree(root._id, view.totalRakba, people);
  return toRecords(allocations, viewId);
};

export const applyDistribution = async (viewId, user) => {
  const preview = await previewDistribution(viewId);
  await DistributionModel.deleteMany({ viewId });
  if (preview.length) await DistributionModel.insertMany(preview);
  await writeAuditLog({ action: 'distribution.apply', userId: user.id, entityId: viewId, entityType: 'Distribution', changes: { count: preview.length } });
  return preview;
};

export const getDistributionByView = async (viewId) => DistributionModel.find({ viewId }).lean();
