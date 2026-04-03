'use client';

import { useState } from 'react';

const initialState = {
  viewName: '',
  khataNumber: '',
  plotNumber: '',
  description: '',
};

export default function ViewForm({ onAddView }) {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onAddView(formData);
    setFormData(initialState);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 rounded-lg border border-slate-200 bg-white p-4">
      <input
        className="w-full rounded border border-slate-300 px-3 py-2"
        name="viewName"
        placeholder="View Name"
        value={formData.viewName}
        onChange={handleChange}
        required
      />
      <input
        className="w-full rounded border border-slate-300 px-3 py-2"
        name="khataNumber"
        placeholder="Khata Number"
        value={formData.khataNumber}
        onChange={handleChange}
        required
      />
      <input
        className="w-full rounded border border-slate-300 px-3 py-2"
        name="plotNumber"
        placeholder="Plot Number"
        value={formData.plotNumber}
        onChange={handleChange}
        required
      />
      <textarea
        className="w-full rounded border border-slate-300 px-3 py-2"
        name="description"
        placeholder="Description (optional)"
        value={formData.description}
        onChange={handleChange}
        rows={3}
      />

      <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-700">
        Save View
      </button>
    </form>
  );
}
