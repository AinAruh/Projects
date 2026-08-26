import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface ModalProps { title: string; subtitle?: string; children: ReactNode; onClose: () => void; wide?: boolean }
export function Modal({ title, subtitle, children, onClose, wide }: ModalProps) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
    <div className={`max-h-[92vh] w-full overflow-y-auto rounded-2xl bg-white shadow-2xl ${wide ? 'max-w-3xl' : 'max-w-md'}`}>
      <header className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-6 py-5">
        <div><h2 className="text-xl font-bold text-slate-900">{title}</h2>{subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}</div>
        <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" onClick={onClose} aria-label="Fechar"><X size={20}/></button>
      </header>{children}
    </div>
  </div>;
}
