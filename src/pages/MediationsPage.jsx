import { AlertTriangle, RefreshCw, ShieldCheck } from 'lucide-react';
import { Panel, StatusBadge } from '../components/ui';
import { formatDate } from '../utils/format';

const priorityClass = {
  Alta: 'text-rose-300 bg-rose-500/10 border-rose-500/30',
  Média: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
  Baixa: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
};

export const MediationsPage = ({ mediations, onUpdateStatus, onClose }) => (
  <Panel title="Mediações" subtitle="Acompanhe urgência, status e andamento dos casos">
    <div className="space-y-4">
      {mediations.map((med) => (
        <div key={med.id} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs text-slate-500">{med.id} • venda {med.saleId}</p>
              <h3 className="text-lg font-semibold text-slate-100">{med.buyer}</h3>
              <p className="text-sm text-slate-400">Abertura: {formatDate(med.openDate)}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={med.status} />
              <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${priorityClass[med.priority]}`}>
                <AlertTriangle size={13} /> {med.priority}
              </span>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-400">{med.notes}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={() => onUpdateStatus(med.id)} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-200"><RefreshCw size={14} /> Atualizar</button>
            <button onClick={() => onClose(med.id)} className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-200"><ShieldCheck size={14} /> Encerrar</button>
          </div>
        </div>
      ))}
    </div>
  </Panel>
);
