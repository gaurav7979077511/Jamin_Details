'use client';

import { useState } from 'react';
import TreeNode from '../components/TreeNode';
import ViewForm from '../components/ViewForm';
import ViewList from '../components/ViewList';
import familyTree from '../data/familyTree.json';

export default function Page() {
  const [showForm, setShowForm] = useState(false);
  const [views, setViews] = useState([]);

  const handleAddView = (viewData) => {
    setViews((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        ...viewData,
      },
    ]);
    setShowForm(false);
  };

  return (
    <main className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Vanshawali Viewer</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 p-4">
          <h2 className="mb-4 text-lg font-semibold">Family Tree</h2>
          <TreeNode node={familyTree} />
        </section>

        <section className="rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Views</h2>
            <button
              className="rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-500"
              onClick={() => setShowForm((prev) => !prev)}
            >
              Create New View
            </button>
          </div>

          {showForm ? <ViewForm onAddView={handleAddView} /> : null}
          <ViewList views={views} />
        </section>
      </div>
    </main>
  );
}
