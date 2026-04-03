import { applyDistribution, getDistributionByView, previewDistribution } from '../../application/services/distribution-app.service.js';

export const preview = async (req, res) => {
  try {
    res.json(await previewDistribution(req.params.viewId));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const apply = async (req, res) => {
  try {
    res.json(await applyDistribution(req.body.viewId, req.user));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getDistribution = async (req, res) => {
  res.json(await getDistributionByView(req.params.viewId));
};
