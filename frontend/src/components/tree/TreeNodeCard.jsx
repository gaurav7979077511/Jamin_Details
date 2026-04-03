import React from 'react';

const TreeNodeCard = React.memo(({ data, onToggle, canEdit, onAdd, onEdit, onDelete, collapsed }) => (
  <div className="rounded-xl bg-white border shadow p-3 min-w-[230px]">
    <div className="font-semibold text-slate-800">{data.person.name}</div>
    <div className="text-slate-500 text-sm">{data.person.hindiName}</div>
    <div className="mt-1 text-sm">Share: {Number(data.share).toFixed(2)}</div>
    <div className="mt-2 flex gap-1 flex-wrap">
      <button className="px-2 py-1 text-xs bg-slate-200 rounded" onClick={() => onToggle(data.person._id)}>{collapsed ? 'Expand' : 'Collapse'}</button>
      {canEdit && (
        <>
          <button className="px-2 py-1 text-xs bg-blue-100 rounded" onClick={() => onAdd(data.person._id)}>Add child</button>
          <button className="px-2 py-1 text-xs bg-yellow-100 rounded" onClick={() => onEdit(data.person)}>Edit</button>
          <button className="px-2 py-1 text-xs bg-red-100 rounded" onClick={() => onDelete(data.person)}>Delete</button>
        </>
      )}
    </div>
  </div>
));

export default TreeNodeCard;
