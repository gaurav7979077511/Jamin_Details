export default function ViewList({ views }) {
  if (views.length === 0) {
    return <p className="mt-4 text-sm text-slate-500">No views created yet.</p>;
  }

  return (
    <div className="mt-4 space-y-3">
      {views.map((view) => (
        <div key={view.id} className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="font-medium">View Name: {view.viewName}</p>
          <p className="text-sm text-slate-700">Khata: {view.khataNumber}</p>
          <p className="text-sm text-slate-700">Plot: {view.plotNumber}</p>
          {view.description ? <p className="text-sm text-slate-500">{view.description}</p> : null}
        </div>
      ))}
    </div>
  );
}
