import React from 'react';
import { ShieldCheck, SlidersHorizontal, Bell, Coins } from 'lucide-react';
import { AppNotification } from '../types';

interface TopAppBarProps {
  notifications: AppNotification[];
  walletBalance: number;
  onOpenNotifications: () => void;
  onOpenFilters: () => void;
  onGoToWallet: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  notifications,
  walletBalance,
  onOpenNotifications,
  onOpenFilters,
  onGoToWallet,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 flex justify-between items-center px-4 h-16 w-full max-w-md mx-auto bg-[#0f131d]/90 backdrop-blur-md border-b border-white/5">
      {/* Brand & Escrow Logo */}
      <div className="flex items-center gap-2.5">
        <div className="relative w-9 h-9 rounded-full p-[1.5px] bg-gradient-to-tr from-[#a08e7a] to-[#ffc174] shadow-md">
          <div className="w-full h-full rounded-full bg-[#1c1f2a] flex items-center justify-center overflow-hidden">
            <ShieldCheck className="w-5 h-5 text-[#ffc174]" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#4edea3] rounded-full border-2 border-[#0f131d]" />
        </div>
        <div>
          <span className="text-[17px] font-bold text-[#ffc174] tracking-tight block leading-none">
            ArenaLive
          </span>
          <span className="text-[9px] font-bold text-[#d8c3ad] tracking-widest uppercase">
            VERIFIED ESCROW
          </span>
        </div>
      </div>

      {/* Right Action Icons & Wallet Badge */}
      <div className="flex items-center gap-2">
        {/* Quick Wallet balance pill */}
        <button
          onClick={onGoToWallet}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#171b26] border border-white/10 text-xs font-semibold text-[#ffc174] hover:bg-[#262a35] transition-colors active:scale-95"
          title="Ver mi Wallet"
        >
          <Coins className="w-3.5 h-3.5 text-[#f59e0b]" />
          <span className="font-mono">{walletBalance.toLocaleString('es-AR')}</span>
        </button>

        {/* Filter / Tune */}
        <button
          onClick={onOpenFilters}
          className="relative p-2 rounded-xl bg-[#171b26] text-[#dfe2f1] hover:text-[#ffc174] hover:bg-[#262a35] transition-colors active:scale-95"
          title="Filtros"
        >
          <SlidersHorizontal className="w-[18px] h-[18px]" />
        </button>

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl bg-[#171b26] text-[#dfe2f1] hover:text-[#ffc174] hover:bg-[#262a35] transition-colors active:scale-95"
          title="Notificaciones"
        >
          <Bell className="w-[18px] h-[18px]" />
          {unreadCount > 0 && (
            <>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#f59e0b] animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#f59e0b]" />
            </>
          )}
        </button>
      </div>
    </header>
  );
};
