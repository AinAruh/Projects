import { typeLabels, type Asset } from '../../../types/asset';
import { StatusBadge } from './StatusBadge';

export function AssetDetails({ asset, onClose }: { asset: Asset; onClose: () => void }) {
  const fields = [
    ['Código', asset.code], ['Nome', asset.name], ['Tipo', typeLabels[asset.type]],
    ['Fabricante', asset.manufacturer], ['Modelo', asset.model], ['Número de série', asset.serialNumber],
    ['Data de cadastro', new Date(asset.createdAt).toLocaleString('pt-BR')], ['ID', asset.id],
  ];
  return <div className="p-6">
    <div className="mb-6"><StatusBadge status={asset.status}/></div>
    <dl className="grid gap-5 sm:grid-cols-2">
      {fields.map(([label, value]) => <div key={label} className="min-w-0"><dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</dt><dd className="mt-1.5 break-words text-sm font-medium text-slate-800">{value}</dd></div>)}
      <div className="sm:col-span-2"><dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Descrição</dt><dd className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">{asset.description || 'Sem descrição.'}</dd></div>
    </dl>
    <div className="mt-7 flex justify-end border-t border-slate-100 pt-5"><button onClick={onClose} className="secondary-button">Fechar</button></div>
  </div>;
}