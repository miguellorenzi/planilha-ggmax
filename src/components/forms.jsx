export const Modal = ({ open, title, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
          <button onClick={onClose} className="rounded-lg border border-slate-700 px-3 py-1 text-sm text-slate-300">Fechar</button>
        </div>
        {children}
      </div>
    </div>
  );
};

export const Input = ({ label, ...props }) => (
  <label className="text-sm text-slate-300">
    {label}
    <input {...props} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2" />
  </label>
);

export const Select = ({ label, options, ...props }) => (
  <label className="text-sm text-slate-300">
    {label}
    <select {...props} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2">
      {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </label>
);
