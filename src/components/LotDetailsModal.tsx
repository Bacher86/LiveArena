import React from 'react';
import { X, ShieldCheck, Timer, Gavel, UserCheck, Star, ArrowUpRight } from 'lucide-react';
import { AuctionItem } from '../types';

interface LotDetailsModalProps {
  item: AuctionItem;
  onClose: () => void;
  onOpenBid: () => void;
}

export const LotDetailsModal: React.FC<LotDetailsModalProps> = ({ item, onClose, onOpenBid }) => {
  const bidHistory = [
    { user: item.leaderUsername || '@SpeedyGamer', amount: item.highestBid, time: 'Hace 4m', isLeader: true },
    { user: 'Tú (Oferta retenida)', amount: item.userBid, time: 'Hace 18m', isLeader: false },
    { user: '@LucasDev', amount: item.userBid - 1500, time: 'Hace 35m', isLeader: false },
    { user: '@MaxiGamer99', amount: item.userBid - 3000, time: 'Hace 1h', isLeader: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#1c1f2a] border border-white/10 rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#93000a]/40 border border-[#ffb4ab]/30 text-[#ffb4ab] text-[10px] font-bold uppercase tracking-wider">
              Lote Oficial #AR-809
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#262a35] text-[#dfe2f1] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hero image and title */}
        <div className="my-4">
          <div className="w-full h-44 rounded-xl overflow-hidden bg-[#171b26] relative border border-white/10">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-xs text-[#ffc174] font-mono font-bold">
              <Timer className="w-3.5 h-3.5" />
              <span>Restan 42m</span>
            </div>
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-[#0f131d]/90 text-[10px] font-bold text-[#4edea3] flex items-center gap-1 border border-white/10">
              <ShieldCheck className="w-3 h-3" />
              <span>Custodia Activa</span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-[#dfe2f1] mt-3 leading-tight">{item.title}</h3>
          <p className="text-xs text-[#d8c3ad] mt-0.5">{item.subtitle}</p>
        </div>

        {/* Current Bid Status */}
        <div className="p-3.5 rounded-xl bg-[#171b26] border border-white/5 mb-4 grid grid-cols-2 gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#d8c3ad] block">
              Oferta Ganadora
            </span>
            <span className="text-xl font-bold text-[#ffc174] font-mono">
              {item.highestBid.toLocaleString('es-AR')}{' '}
              <span className="text-xs text-[#d8c3ad]">COINS</span>
            </span>
            <span className="text-[11px] text-[#4edea3] block font-medium">
              Líder: {item.leaderUsername || '@SpeedyGamer'}
            </span>
          </div>
          <div className="border-l border-white/10 pl-3">
            <span className="text-[10px] uppercase font-bold text-[#d8c3ad] block">
              Precio Reserva
            </span>
            <span className="text-sm font-bold text-[#4edea3] font-mono flex items-center gap-1 mt-1">
              <ShieldCheck className="w-4 h-4" /> Superada (60k)
            </span>
            <span className="text-[10px] text-[#d8c3ad] block">Adjudicación inmediata</span>
          </div>
        </div>

        {/* Seller reputation */}
        <div className="p-3 rounded-xl bg-[#0a0e18] border border-white/5 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#f59e0b]/20 flex items-center justify-center text-[#ffc174] font-bold text-xs">
              TS
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-[#dfe2f1]">TechStore BA</span>
                <UserCheck className="w-3.5 h-3.5 text-[#4edea3]" />
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[#d8c3ad]">
                <Star className="w-3 h-3 text-[#f59e0b] fill-[#f59e0b]" />
                <span>99.8% (428 subastas completadas)</span>
              </div>
            </div>
          </div>
          <span className="text-[10px] font-bold text-[#4edea3] uppercase tracking-wider bg-[#4edea3]/10 px-2 py-1 rounded">
            Verificado
          </span>
        </div>

        {/* Live Bid history list */}
        <div className="mb-5">
          <span className="text-xs font-bold text-[#dfe2f1] block mb-2">
            Registro en Vivo de Pujas
          </span>
          <div className="space-y-1.5 font-mono text-xs">
            {bidHistory.map((bh, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg flex items-center justify-between ${
                  bh.isLeader
                    ? 'bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[#ffc174]'
                    : 'bg-[#171b26] text-[#dfe2f1]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Gavel className="w-3.5 h-3.5 text-[#d8c3ad]" />
                  <span className="font-sans font-medium">{bh.user}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{bh.amount.toLocaleString('es-AR')} Coins</span>
                  <span className="text-[10px] text-[#a08e7a] font-sans">{bh.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => {
            onClose();
            onOpenBid();
          }}
          className="w-full py-3 rounded-xl bg-[#f59e0b] hover:bg-[#ffc174] text-[#0f131d] font-bold text-sm shadow-[0_0_20px_-2px_rgba(245,158,11,0.5)] transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Gavel className="w-4 h-4" />
          <span>Recuperar Liderazgo (Pujar 68.000 Coins)</span>
        </button>
      </div>
    </div>
  );
};
