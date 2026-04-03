export default function Modal({ title, open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-5 w-full max-w-lg">
        <div className="font-semibold mb-3">{title}</div>
        {children}
        <div className="mt-4">
          <button className="px-3 py-1 rounded bg-slate-200" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
