import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
  busy?: boolean;
}

export function Modal({ title, subtitle, children, onClose, wide, busy = false }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const subtitleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      previousFocus?.focus();
    };
  }, []);

  return <dialog ref={ref} aria-labelledby={titleId} aria-describedby={subtitle ? subtitleId : undefined} aria-busy={busy} onCancel={event => { event.preventDefault(); if (!busy) onClose(); }} className={`m-auto max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-2xl border-0 bg-white p-0 shadow-2xl backdrop:bg-slate-950/60 backdrop:backdrop-blur-sm ${wide ? 'max-w-2xl' : 'max-w-lg'}`}>
    <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 py-5">
      <div className="min-w-0"><h2 id={titleId} className="text-xl font-bold text-slate-900">{title}</h2>{subtitle && <p id={subtitleId} className="mt-1 break-words text-sm leading-6 text-slate-500">{subtitle}</p>}</div>
      <button type="button" disabled={busy} className="action-button" onClick={onClose} aria-label="Fechar"><X size={20}/></button>
    </header>{children}
  </dialog>;
}