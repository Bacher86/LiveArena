import React, { useState } from 'react';
import { X, Gavel, ShieldCheck, Zap, AlertTriangle, ArrowRight } from 'lucide-react';
import { AuctionItem } from '../types';

interface BiddingModalProps {
  item: AuctionItem | null;
  walletBalance: number;
  onClose: () => void;
  onPlaceBid: (itemId: string, newBid: number, autoBidLimit?: number) => void;
}

export const BiddingModal: React.FC<BiddingModalProps> = ({
  item,
  walletBalance,
  onClose,
  onPlaceBid,
}) => {
  if (!item) return null;

  const minNextBid = Math.max(item.highestBid + item.minIncrement, item.userBid + item.minIncrement);
  const [bidAmount, setBidAmount] = useState<number>(minNextBid);
  const [enableAutoBid, setEnableAutoBid] = useState<boolean>(!!item.autoBidMax);
  const [autoBidLimit, setAutoBidLimit] = useState<number>(item.autoBidMax || minNextBid + 5000);

  const increments = [500, 1000, 2500, 5000];

  const handleIncrement = (inc: number) => {
    setBidAmount((prev) => prev + inc);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bidAmount < minNextBid) return;
    onPlaceBid(item.id, bidAmount, enableAutoBid ? autoBidLimit : undefined);
    onClose();
  };

  const hasEnoughBalance = walletBalance >= bidAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#1c1f2a] border border-white/10 rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/20 flex items-center justify-center text-[#f59e0b]">
              <Gavel className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#dfe2f1]">Pujar en Subasta</h3>
              <p className="text-xs text-[#d8c3ad] truncate max-w-[220px]">{item.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#262a35] text-[#dfe2f1] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current State Info */}
        <div className="my-4 p-3 rounded-xl bg-[#171b26] border border-white/5 grid grid-cols-2 gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#d8c3ad] block">
              Puja Líder Actual
            </span>
            <span className="text-lg font-bold text-[#ffc174] font-mono">
              {item.highestBid.toLocaleString('es-AR')}{' '}
              <span className="text-xs text-[#d8c3ad]">COINS</span>
            </span>
            {item.leaderUsername && (
              <span className="text-[11px] text-[#4edea3] block">{item.leaderUsername}</span>
            )}
          </div>
          <div className="border-l border-white/10 pl-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#d8c3ad] block">
              Tu Saldo Disponible
            </span>
            <span className="text-lg font-bold text-[#dfe2f1] font-mono">
              {walletBalance.toLocaleString('es-AR')}{' '}
              <span className="text-xs text-[#d8c3ad]">COINS</span>
            </span>
            <span className="text-[11px] text-[#d8c3ad] block">≈ ${(walletBalance * 10).toLocaleString('es-AR')} ARS</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Bid input */}
          <div>
            <label className="text-xs font-bold text-[#dfe2f1] block mb-1.5">
              Tu Nueva Oferta (Mínimo: {minNextBid.toLocaleString('es-AR')} Coins)
            </label>
            <div className="relative">
              <input
                type="number"
                min={minNextBid}
                step={item.minIncrement}
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                className="w-full h-12 bg-[#0a0e18] border border-[#ffc174]/40 rounded-xl px-4 text-xl font-bold font-mono text-[#ffc174] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
              />
              <span className="absolute right-4 top-3 text-xs font-bold text-[#d8c3ad]">
                COINS
              </span>
            </div>
            <p className="text-[11px] text-[#d8c3ad] mt-1">
              Equivale aproximadamente a ${(bidAmount * 10).toLocaleString('es-AR')} ARS
            </p>
          </div>

          {/* Quick Increment Buttons */}
          <div>
            <span className="text-[11px] text-[#d8c3ad] font-semibold block mb-1.5">
              Incrementos rápidos recomendados:
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {increments.map((inc) => (
                <button
                  key={inc}
                  type="button"
                  onClick={() => handleIncrement(inc)}
                  className="py-1.5 px-1 rounded-lg bg-[#262a35] hover:bg-[#353944] border border-white/5 text-xs font-mono font-bold text-[#ffc174] transition-colors active:scale-95"
                >
                  +{inc.toLocaleString('es-AR')}
                </button>
              ))}
            </div>
          </div>

          {/* Auto-bid option */}
          <div className="p-3 rounded-xl bg-[#171b26] border border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#f59e0b]" />
                <span className="text-xs font-bold text-[#dfe2f1]">Activar Auto-Puja</span>
              </div>
              <input
                type="checkbox"
                checked={enableAutoBid}
                onChange={(e) => setEnableAutoBid(e.target.checked)}
                className="w-4 h-4 rounded text-[#f59e0b] focus:ring-[#f59e0b] bg-[#0a0e18] border-white/20"
              />
            </div>
            {enableAutoBid && (
              <div className="mt-2 pt-2 border-t border-white/5">
                <label className="text-[11px] text-[#d8c3ad] block mb-1">
                  Límite máximo de auto-puja:
                </label>
                <input
                  type="number"
                  min={bidAmount + 500}
                  step={500}
                  value={autoBidLimit}
                  onChange={(e) => setAutoBidLimit(Number(e.target.value))}
                  className="w-full h-9 bg-[#0a0e18] border border-white/10 rounded-lg px-3 text-sm font-mono text-[#ffc174] focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
                />
                <span className="text-[10px] text-[#4edea3] block mt-1">
                  El sistema responderá automáticamente con +500 Coins si otro usuario te supera.
                </span>
              </div>
            )}
          </div>

          {/* Escrow Guarantee Disclaimer */}
          <div className="p-3 rounded-xl bg-[#0a0e18] border border-[#4edea3]/20 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#4edea3] flex-shrink-0 mt-0.5" />
            <div className="text-[11px] text-[#d8c3ad] leading-snug">
              <strong className="text-[#dfe2f1] block">Garantía Escrow ArenaShield™</strong>
              Las monedas se retienen de forma segura. Si otro participante supera tu puja, el
              100% de tus coins se desbloquean inmediatamente en tu Wallet.
            </div>
          </div>

          {!hasEnoughBalance && (
            <div className="p-2.5 rounded-lg bg-[#93000a]/30 border border-[#ffb4ab]/30 flex items-center gap-2 text-xs text-[#ffb4ab]">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>Saldo insuficiente. Necesitas {bidAmount.toLocaleString('es-AR')} Coins.</span>
            </div>
          )}

          {/* Confirm Button */}
          <button
            type="submit"
            disabled={!hasEnoughBalance || bidAmount < minNextBid}
            className="w-full py-3 rounded-xl bg-[#f59e0b] hover:bg-[#ffc174] text-[#0f131d] font-bold text-sm shadow-[0_0_20px_-2px_rgba(245,158,11,0.5)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span>Confirmar Puja ({bidAmount.toLocaleString('es-AR')} Coins)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
