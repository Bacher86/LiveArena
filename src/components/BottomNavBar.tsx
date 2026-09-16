import React from 'react';
import { Home, Compass, Plus, Ticket, Wallet } from 'lucide-react';
import { NavTab } from '../types';

interface BottomNavBarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeItemsCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onSelectTab,
  activeItemsCount = 4,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center px-3 pb-safe h-16 w-full max-w-md mx-auto bg-[#171b26]/95 backdrop-blur-xl border-t border-white/5 shadow-[0_-8px_24px_rgba(0,0,0,0.6)]">
      {/* 0: Inicio */}
      <button
        onClick={() => onSelectTab('inicio')}
        className={`flex flex-col items-center justify-center py-1 transition-colors duration-150 active:scale-95 ${
          currentTab === 'inicio' ? 'text-[#ffc174] font-bold' : 'text-[#a08e7a] hover:text-[#dfe2f1]'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-bold tracking-wider uppercase mt-1">Inicio</span>
      </button>

      {/* 1: Explorar */}
      <button
        onClick={() => onSelectTab('explorar')}
        className={`flex flex-col items-center justify-center py-1 transition-colors duration-150 active:scale-95 ${
          currentTab === 'explorar' ? 'text-[#ffc174] font-bold' : 'text-[#a08e7a] hover:text-[#dfe2f1]'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] font-bold tracking-wider uppercase mt-1">Explorar</span>
      </button>

      {/* 2: Publicar (Center Action Prominent Pill) */}
      <button
        onClick={() => onSelectTab('publicar')}
        className="flex flex-col items-center justify-center -mt-5 group active:scale-90 transition-transform duration-150"
      >
        <div className="w-12 h-12 rounded-full bg-[#f59e0b] text-[#0f131d] flex items-center justify-center shadow-[0_0_20px_-2px_rgba(245,158,11,0.5)] border-2 border-[#0f131d] group-hover:brightness-110 transition-all">
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </div>
        <span className="text-[10px] text-[#f59e0b] font-bold tracking-wider uppercase mt-0.5">
          Publicar
        </span>
      </button>

      {/* 3: Mis Cosas (Active Tab in screenshot) */}
      <button
        onClick={() => onSelectTab('mis_cosas')}
        className={`flex flex-col items-center justify-center py-1 transition-colors duration-150 active:scale-95 ${
          currentTab === 'mis_cosas' ? 'text-[#ffc174] font-bold' : 'text-[#a08e7a] hover:text-[#dfe2f1]'
        }`}
      >
        <div className="relative">
          <Ticket className="w-5 h-5" />
          {activeItemsCount > 0 && (
            <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-[#f59e0b]" />
          )}
        </div>
        <span className="text-[10px] font-bold tracking-wider uppercase mt-1">Mis Cosas</span>
      </button>

      {/* 4: Wallet */}
      <button
        onClick={() => onSelectTab('wallet')}
        className={`flex flex-col items-center justify-center py-1 transition-colors duration-150 active:scale-95 ${
          currentTab === 'wallet' ? 'text-[#ffc174] font-bold' : 'text-[#a08e7a] hover:text-[#dfe2f1]'
        }`}
      >
        <Wallet className="w-5 h-5" />
        <span className="text-[10px] font-bold tracking-wider uppercase mt-1">Wallet</span>
      </button>
    </nav>
  );
};
