import { create } from 'zustand';

export const useTreeStore = create((set) => ({
  collapsed: {},
  collapseAll: (ids) => set({ collapsed: Object.fromEntries(ids.map((id) => [id, true])) }),
  expandAll: () => set({ collapsed: {} }),
  toggleNode: (id) => set((state) => ({ collapsed: { ...state.collapsed, [id]: !state.collapsed[id] } }))
}));
