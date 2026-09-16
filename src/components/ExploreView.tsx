import React, { useState } from 'react';
import { Compass, ShieldCheck, Timer, Gavel, Ticket, Flame, Search } from 'lucide-react';
import { exploreItems } from '../data/mockData';

interface ExploreViewProps {
  onSelectAuction: (item: any) => void;
  onSelectRaffle: (item: any) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  onSelectAuction,
  onSelectRaffle,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<'all' | 'subasta' | 'rifa'>('all');

  const filtered = exploreItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || item.type === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-4 pb-20 animate-in fade-in duration-200">
      {/* Header & Search */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#dfe2f1]">Explorar la Arena</h2>
            <p className="text-xs text-[#d8c3ad]">Subastas activas y rifas oficiales en vivo</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#f59e0b]/15 text-[#ffc174] text-[10px] font-bold flex items-center gap-1">
            <Flame className="w-3 h-3 text-[#f59e0b]" /> 14 Lotes en Vivo
          </span>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#a08e7a] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por iPhone, PlayStation, motos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 bg-[#171b26] border border-white/10 rounded-xl pl-9 pr-3 text-xs text-[#dfe2f1] focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2">
          {(['all', 'subasta', 'rifa'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                category === cat
                  ? 'bg-[#f59e0b] text-[#0f131d]'
                  : 'bg-[#171b26] text-[#d8c3ad] hover:bg-[#262a35]'
              }`}
            >
              {cat === 'all' ? 'Todos los Lotes' : cat === 'subasta' ? 'Subastas' : 'Rifas'}
            </button>
          ))}
        </div>
      </div>

      {/* Explore Grid */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <article
            key={item.id}
            className="p-3.5 rounded-xl bg-[#1c1f2a] border border-white/10 flex flex-col gap-3 shadow-lg hover:border-[#ffc174]/40 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded-xl bg-[#262a35] overflow-hidden border border-white/10 relative flex-shrink-0">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[8px] font-bold text-center text-[#ffc174] uppercase py-0.5">
                  {item.type}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="px-1.5 py-0.5 rounded bg-[#4edea3]/15 text-[#4edea3] text-[9px] font-bold flex items-center gap-0.5 font-mono">
                    <ShieldCheck className="w-2.5 h-2.5" /> Verificado
                  </span>
                  <span className="font-mono text-xs font-bold text-[#ffc174] flex items-center gap-1">
                    <Timer className="w-3 h-3" /> {item.timeLeft}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#dfe2f1] mt-1 leading-tight">{item.title}</h3>
                <p className="text-[11px] text-[#d8c3ad]">{item.subtitle}</p>
              </div>
            </div>

            {/* Telemetry and Action */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#a08e7a] block">
                  {item.type === 'subasta' ? 'Oferta Actual' : 'Valor del Ticket'}
                </span>
                <span className="font-mono text-sm font-bold text-[#ffc174]">
                  {item.type === 'subasta'
                    ? `${item.currentBid?.toLocaleString('es-AR')} Coins`
                    : `${item.ticketPrice?.toLocaleString('es-AR')} Coins`}
                </span>
              </div>

              {item.type === 'subasta' ? (
                <button
                  onClick={() => onSelectAuction(item)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#f59e0b] hover:bg-[#ffc174] text-[#0f131d] font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Gavel className="w-3.5 h-3.5" />
                  <span>Pujar Ahora</span>
                </button>
              ) : (
                <button
                  onClick={() => onSelectRaffle(item)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#262a35] hover:bg-[#353944] text-[#ffc174] font-bold text-xs border border-[#ffc174]/30 transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Comprar Tickets</span>
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
