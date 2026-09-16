import React from 'react';
import { X, SlidersHorizontal, Check } from 'lucide-react';

interface FilterModalProps {
  selectedFilter: 'all' | 'rifas' | 'subastas_lider' | 'subastas_superadas';
  onSelectFilter: (filter: 'all' | 'rifas' | 'subastas_lider' | 'subastas_superadas') => void;
  onClose: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  selectedFilter,
  onSelectFilter,
  onClose,
}) => {
  const options: { id: 'all' | 'rifas' | 'subastas_lider' | 'subastas_superadas'; label: string; desc: string }[] = [
    { id: 'all', label: 'Todas las participaciones', desc: 'Ver rifas activas y todas las subastas en curso' },
    { id: 'rifas', label: 'Solo Rifas Oficiales', desc: 'Participaciones con tickets respaldados por Lotería Nacional' },
    { id: 'subastas_lider', label: 'Pujas Líderes', desc: 'Lotes donde tu oferta es la más alta en este momento' },
    { id: 'subastas_superadas', label: 'Pujas Superadas (Acción requerida)', desc: 'Lotes donde necesitas re-pujar para ganar' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#1c1f2a] border border-white/10 rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/20 flex items-center justify-center text-[#ffc174]">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#dfe2f1]">Filtrar Mis Cosas</h3>
              <p className="text-xs text-[#d8c3ad]">Organiza tus participaciones activas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#262a35] text-[#dfe2f1] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 my-4">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                onSelectFilter(opt.id);
                onClose();
              }}
              className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                selectedFilter === opt.id
                  ? 'bg-[#f59e0b]/10 border-[#f59e0b] text-[#ffc174]'
                  : 'bg-[#171b26] border-white/5 text-[#dfe2f1] hover:bg-[#262a35]'
              }`}
            >
              <div>
                <span className="text-sm font-bold block">{opt.label}</span>
                <span className="text-[11px] text-[#d8c3ad] block">{opt.desc}</span>
              </div>
              {selectedFilter === opt.id && <Check className="w-4 h-4 text-[#f59e0b]" />}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#262a35] hover:bg-[#353944] text-[#dfe2f1] font-bold text-xs transition-colors"
        >
          Aplicar Filtro
        </button>
      </div>
    </div>
  );
};
