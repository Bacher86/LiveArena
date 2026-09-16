import React, { useState } from 'react';
import { X, Ticket, ShieldCheck, Fingerprint, Plus, Minus, Check } from 'lucide-react';
import { RaffleItem } from '../types';

interface BuyTicketsModalProps {
  raffle: RaffleItem;
  walletBalance: number;
  onClose: () => void;
  onBuyTickets: (quantity: number, generatedNumbers: string[]) => void;
}

export const BuyTicketsModal: React.FC<BuyTicketsModalProps> = ({
  raffle,
  walletBalance,
  onClose,
  onBuyTickets,
}) => {
  const [quantity, setQuantity] = useState<number>(2);
  const totalCost = quantity * raffle.ticketPriceCoins;
  const hasBalance = walletBalance >= totalCost;

  const currentCount = raffle.assignedTickets.length;
  const newTotalCount = currentCount + quantity;
  const currentProb = ((currentCount / raffle.totalTickets) * 100).toFixed(2);
  const newProb = ((newTotalCount / raffle.totalTickets) * 100).toFixed(2);

  const handleAdd = (amount: number) => {
    setQuantity((prev) => Math.min(prev + amount, 50));
  };

  const handleMinus = (amount: number) => {
    setQuantity((prev) => Math.max(prev - amount, 1));
  };

  // Preview generated numbers
  const previewNumbers = Array.from({ length: Math.min(quantity, 4) }, (_, i) => {
    const num = Math.floor(1000 + Math.random() * 8999);
    return `#${num}`;
  });

  const handleConfirm = () => {
    if (!hasBalance) return;
    const generated: string[] = [];
    for (let i = 0; i < quantity; i++) {
      const pad = String(Math.floor(1 + Math.random() * 9999)).padStart(4, '0');
      generated.push(`#${pad}`);
    }
    onBuyTickets(quantity, generated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#1c1f2a] border border-white/10 rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#4edea3]/20 flex items-center justify-center text-[#4edea3]">
              <Ticket className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#dfe2f1]">Comprar Tickets Oficiales</h3>
              <p className="text-xs text-[#d8c3ad] truncate max-w-[220px]">{raffle.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#262a35] text-[#dfe2f1] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quantity selector */}
        <div className="my-5 flex flex-col items-center justify-center">
          <span className="text-xs uppercase font-bold tracking-wider text-[#d8c3ad] mb-2">
            Cantidad de números a emitir
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleMinus(1)}
              className="w-10 h-10 rounded-xl bg-[#262a35] hover:bg-[#353944] text-[#dfe2f1] flex items-center justify-center active:scale-95 transition-all"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="w-20 text-center">
              <span className="text-4xl font-extrabold font-mono text-[#ffc174]">{quantity}</span>
            </div>
            <button
              onClick={() => handleAdd(1)}
              className="w-10 h-10 rounded-xl bg-[#262a35] hover:bg-[#353944] text-[#dfe2f1] flex items-center justify-center active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Quick chips */}
          <div className="flex gap-2 mt-3">
            {[1, 5, 10, 20].map((val) => (
              <button
                key={val}
                onClick={() => setQuantity(val)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                  quantity === val
                    ? 'bg-[#f59e0b] text-[#0f131d]'
                    : 'bg-[#171b26] text-[#d8c3ad] hover:bg-[#262a35]'
                }`}
              >
                +{val}
              </button>
            ))}
          </div>
        </div>

        {/* Probability & Cost cards */}
        <div className="space-y-3 mb-5">
          <div className="p-3 rounded-xl bg-[#171b26] border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#d8c3ad] block">
                Probabilidad Acumulada
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-[#a08e7a] line-through font-mono">{currentProb}%</span>
                <span className="text-sm font-bold text-[#4edea3] font-mono">
                  {newProb}% ({newTotalCount} / {raffle.totalTickets.toLocaleString('es-AR')})
                </span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#4edea3]/10 flex items-center justify-center text-[#4edea3]">
              <Fingerprint className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#171b26] border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#d8c3ad] block">
                Total a Debitar
              </span>
              <span className="text-lg font-bold text-[#ffc174] font-mono">
                {totalCost.toLocaleString('es-AR')}{' '}
                <span className="text-xs text-[#d8c3ad]">COINS</span>
              </span>
              <span className="text-[11px] text-[#d8c3ad] block">
                ≈ ${(totalCost * 10).toLocaleString('es-AR')} ARS
              </span>
            </div>
            <div className="text-right text-xs">
              <span className="text-[#d8c3ad] block">Saldo restante:</span>
              <span className="font-mono text-[#dfe2f1] font-semibold">
                {(walletBalance - totalCost).toLocaleString('es-AR')} Coins
              </span>
            </div>
          </div>

          {/* Ticket preview */}
          <div className="p-3 rounded-xl bg-[#0a0e18] border border-white/5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] uppercase font-bold text-[#d8c3ad]">
                Asignación Aleatoria Certificada
              </span>
              <span className="text-[10px] text-[#4edea3] flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3 h-3" /> SHA-256 On-Chain
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {previewNumbers.map((num, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 rounded bg-[#1c1f2a] border border-[#f59e0b]/40 text-[#ffc174]"
                >
                  {num}
                </span>
              ))}
              {quantity > 4 && (
                <span className="px-2 py-1 rounded bg-[#1c1f2a] text-[#d8c3ad]">
                  +{quantity - 4} más...
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleConfirm}
          disabled={!hasBalance}
          className="w-full py-3 rounded-xl bg-[#f59e0b] hover:bg-[#ffc174] text-[#0f131d] font-bold text-sm shadow-[0_0_20px_-2px_rgba(245,158,11,0.5)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Confirmar y Emitir Tickets</span>
        </button>
      </div>
    </div>
  );
};
