import { Pencil, CheckCircle2, PlusCircle } from 'lucide-react';
import { Panel, StatusBadge } from '../components/ui';
import { formatCurrency } from '../utils/format';

export const InventoryPage = ({ inventory, onMarkSold, onEdit, onAdd }) => (
  <div className="space-y-6">
    <div className="flex justify-end">
      <button onClick={onAdd} className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400"><PlusCircle size={16} /> Novo item</button>
    </div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {inventory.map((item) => (
        <Panel key={item.id}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-slate-500">{item.id}</p>
              <h3 className="text-lg font-semibold text-slate-100">{item.name}</h3>
              <p className="text-sm text-slate-400">{item.game} • {item.type}</p>
            </div>
            <StatusBadge status={item.status} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm">
            <div>
              <p className="text-slate-500">Preço esperado</p>
              <p className="font-medium text-slate-100">{formatCurrency(item.expectedPrice)}</p>
            </div>
            <div>
              <p className="text-slate-500">Custo</p>
              <p className="font-medium text-slate-100">{formatCurrency(item.cost)}</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-400">{item.notes}</p>
          <div className="mt-4 flex gap-2">
            <button onClick={() => onMarkSold(item.id)} className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200"><CheckCircle2 size={14} /> Marcar como vendido</button>
            <button onClick={() => onEdit(item)} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-200"><Pencil size={14} /> Editar</button>
          </div>
        </Panel>
      ))}
    </div>
  </div>
);
