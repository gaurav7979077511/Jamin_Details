import { createView, getView, listViews } from '../../application/services/view.service.js';

export const postView = async (req, res) => {
  try {
    const view = await createView(req.body, req.user);
    res.status(201).json(view);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getViews = async (_req, res) => res.json(await listViews());
export const getViewById = async (req, res) => res.json(await getView(req.params.id));
