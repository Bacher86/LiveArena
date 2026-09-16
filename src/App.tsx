import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Zap,
  Trophy,
  History,
  AlertTriangle,
  Gavel,
  Verified,
  Fingerprint,
  Lock,
  Plus,
  Timer,
  CheckCircle2,
  TrendingUp,
  XCircle,
  PartyPopper,
  Truck,
  Check,
} from 'lucide-react';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { BiddingModal } from './components/BiddingModal';
import { BuyTicketsModal } from './components/BuyTicketsModal';
import { CryptoAuditModal } from './components/CryptoAuditModal';
import { ShipmentTrackingModal } from './components/ShipmentTrackingModal';
import { LotDetailsModal } from './components/LotDetailsModal';
import { NotificationsModal } from './components/NotificationsModal';
import { FilterModal } from './components/FilterModal';
import { WalletView } from './components/WalletView';
import { ExploreView } from './components/ExploreView';
import { PublishModal } from './components/PublishModal';

import {
  initialRaffle,
  initialAuctions,
  outbidAlertAuction,
  initialWonItems,
  initialHistory,
  initialNotifications,
} from './data/mockData';
import { ActiveTab, NavTab, AuctionItem, RaffleItem, WonItem, HistoryItem, AppNotification } from './types';

export default function App() {
  // Navigation & Tabs
  const [navTab, setNavTab] = useState<NavTab>('mis_cosas');
  const [activeTab, setActiveTab] = useState<ActiveTab>('en_juego');
  const [filterMode, setFilterMode] = useState<'all' | 'rifas' | 'subastas_lider' | 'subastas_superadas'>('all');

  // Core Data State
  const [raffle, setRaffle] = useState<RaffleItem>(initialRaffle);
  const [auctions, setAuctions] = useState<AuctionItem[]>(initialAuctions);
  const [outbidAuction, setOutbidAuction] = useState<AuctionItem>(outbidAlertAuction);
  const [wonItems, setWonItems] = useState<WonItem[]>(initialWonItems);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(initialHistory);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);

  // Financial Wallet State
  const [walletBalance, setWalletBalance] = useState<number>(64500);
  const [lockedInEscrow, setLockedInEscrow] = useState<number>(86500);

  // Modals
  const [biddingItem, setBiddingItem] = useState<AuctionItem | null>(null);
  const [isBuyTicketsOpen, setIsBuyTicketsOpen] = useState<boolean>(false);
  const [isAuditOpen, setIsAuditOpen] = useState<boolean>(false);
  const [trackingItem, setTrackingItem] = useState<WonItem | null>(null);
  const [isLotDetailsOpen, setIsLotDetailsOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [isPublishOpen, setIsPublishOpen] = useState<boolean>(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Live seconds countdown ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setAuctions((prev) =>
        prev.map((auc) => ({
          ...auc,
          timeLeft: Math.max(auc.timeLeft - 1, 0),
        }))
      );
      setOutbidAuction((prev) => ({
        ...prev,
        timeLeft: Math.max(prev.timeLeft - 1, 0),
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format seconds to hh:mm:ss
  const formatTimer = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
    }
    return `${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
  };

  // Handlers for Bidding
  const handlePlaceBid = (itemId: string, newBid: number, autoBidLimit?: number) => {
    if (itemId === outbidAuction.id) {
      // User recovered leadership on PS5 Pro!
      const prevBid = outbidAuction.userBid;
      const additionalCost = newBid - prevBid;
      setWalletBalance((prev) => Math.max(prev - additionalCost, 0));
      setLockedInEscrow((prev) => prev + additionalCost);

      const updatedPs5: AuctionItem = {
        ...outbidAuction,
        status: 'leader',
        userBid: newBid,
        userBidArs: newBid * 10,
        highestBid: newBid,
        leaderUsername: '@Tú (Líder)',
        autoBidMax: autoBidLimit,
      };
      setOutbidAuction(updatedPs5);
      // Also add to active auctions list
      setAuctions((prev) => [updatedPs5, ...prev]);
      showToast(`¡Liderazgo recuperado en ${outbidAuction.title}! Nueva puja: ${newBid.toLocaleString('es-AR')} Coins.`);
      return;
    }

    setAuctions((prev) =>
      prev.map((auc) => {
        if (auc.id === itemId) {
          const diff = newBid - auc.userBid;
          setWalletBalance((b) => Math.max(b - diff, 0));
          setLockedInEscrow((esc) => esc + diff);
          return {
            ...auc,
            status: 'leader',
            userBid: newBid,
            userBidArs: newBid * 10,
            highestBid: newBid,
            leaderUsername: '@Tú (Líder)',
            autoBidMax: autoBidLimit,
          };
        }
        return auc;
      })
    );
    showToast(`¡Puja confirmada con éxito! Oferta líder registrada.`);
  };

  // Handlers for Buy Tickets
  const handleBuyTickets = (qty: number, generatedNumbers: string[]) => {
    const cost = qty * raffle.ticketPriceCoins;
    setWalletBalance((prev) => Math.max(prev - cost, 0));
    setRaffle((prev) => ({
      ...prev,
      assignedTickets: [...prev.assignedTickets, ...generatedNumbers],
      emittedTickets: prev.emittedTickets + qty,
    }));
    showToast(`¡${qty} nuevos tickets emitidos y verificados con SHA-256!`);
  };

  // Handler for retracting/canceling bid on outbid auction
  const handleCancelBid = (itemId: string) => {
    const item = auctions.find((a) => a.id === itemId);
    if (!item) return;
    const refundAmount = item.userBid;
    setWalletBalance((prev) => prev + refundAmount);
    setLockedInEscrow((prev) => Math.max(prev - refundAmount, 0));
    setAuctions((prev) => prev.filter((a) => a.id !== itemId));

    // Add to history
    setHistoryItems((prev) => [
      {
        id: `refund-${Date.now()}`,
        title: item.title,
        type: 'subasta',
        date: 'Hoy',
        outcome: 'superado_reembolsado',
        coins: refundAmount,
        refunded: true,
        escrowStatus: 'Reembolsado al instante',
      },
      ...prev,
    ]);

    showToast(`Puja retirada. Se liberaron ${refundAmount.toLocaleString('es-AR')} Coins a tu saldo disponible.`);
  };

  // Filter items in "En Juego"
  const filterActiveItems = () => {
    if (filterMode === 'rifas') {
      return { showRaffle: true, auctionsList: [] };
    }
    if (filterMode === 'subastas_lider') {
      return {
        showRaffle: false,
        auctionsList: auctions.filter((a) => a.status === 'leader'),
      };
    }
    if (filterMode === 'subastas_superadas') {
      return {
        showRaffle: false,
        auctionsList: auctions.filter((a) => a.status === 'outbid'),
      };
    }
    return { showRaffle: true, auctionsList: auctions };
  };

  const { showRaffle, auctionsList } = filterActiveItems();
  const totalActiveCount = 1 + auctions.length; // raffle + active auctions

  return (
    <div className="relative min-h-screen w-full bg-[#0a0e18] text-[#dfe2f1] flex justify-center selection:bg-[#f59e0b] selection:text-[#0f131d]">
      {/* Container simulating a polished mobile viewport (max-w-md) centered on desktop */}
      <div className="relative w-full max-w-md min-h-screen bg-[#0f131d] shadow-[0_0_50px_rgba(0,0,0,0.8)] border-x border-white/5 flex flex-col pb-24">
        {/* Top App Bar */}
        <TopAppBar
          notifications={notifications}
          walletBalance={walletBalance}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenFilters={() => setIsFilterOpen(true)}
          onGoToWallet={() => setNavTab('wallet')}
        />

        {/* Global Toast Alert */}
        {toastMessage && (
          <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm p-3 rounded-xl bg-[#0f131d] border border-[#4edea3] shadow-[0_4px_20px_rgba(78,222,163,0.3)] text-xs text-[#dfe2f1] flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-[#4edea3] flex-shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
        )}

        {/* SCREEN CONTENT ROUTING */}
        <div className="px-3 pt-3 flex-1 flex flex-col gap-4">
          {/* TAB 1: MIS COSAS (The Primary Spec Screen) */}
          {navTab === 'mis_cosas' && (
            <>
              {/* Section Header & Status Summary Pill */}
              <section className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-extrabold text-[#dfe2f1] tracking-tight">
                      Mis Cosas
                    </h1>
                    <p className="text-xs text-[#d8c3ad]">
                      Participaciones, Pujas & Tickets Oficiales
                    </p>
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-[#262a35] flex items-center gap-1.5 shadow-inner border border-white/5">
                    <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse" />
                    <span className="text-[10px] font-bold text-[#4edea3] tracking-widest uppercase">
                      SYNC LOTERÍA
                    </span>
                  </div>
                </div>

                {/* Quick Summary Badge Strip */}
                <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-lg bg-[#171b26] border border-white/10 text-[#dfe2f1] text-[12px] flex items-center gap-1">
                    <span className="text-[#f59e0b] font-bold">{totalActiveCount}</span> Activas
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#171b26] border border-white/10 text-[#dfe2f1] text-[12px] flex items-center gap-1">
                    <span className="text-[#4edea3] font-bold">{wonItems.length}</span> Ganada
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#171b26] border border-white/10 text-[#dfe2f1] text-[12px] flex items-center gap-1">
                    <span className="text-[#ffc174] font-bold">
                      {raffle.assignedTickets.length}
                    </span>{' '}
                    Tickets
                  </span>
                </div>
              </section>

              {/* Segmented State Tabs: En Juego (4), Ganadas (1), Historial (18) */}
              <nav className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#0a0e18] border border-white/5">
                {/* Tab 1: En Juego */}
                <button
                  onClick={() => setActiveTab('en_juego')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                    activeTab === 'en_juego'
                      ? 'bg-[#f59e0b] text-[#0f131d] shadow-md'
                      : 'text-[#d8c3ad] hover:text-[#dfe2f1]'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>En Juego ({totalActiveCount})</span>
                </button>

                {/* Tab 2: Ganadas */}
                <button
                  onClick={() => setActiveTab('ganadas')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                    activeTab === 'ganadas'
                      ? 'bg-[#4edea3] text-[#003824] shadow-md'
                      : 'text-[#d8c3ad] hover:text-[#4edea3]'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5 text-[#4edea3]" />
                  <span>Ganadas ({wonItems.length})</span>
                </button>

                {/* Tab 3: Historial */}
                <button
                  onClick={() => setActiveTab('historial')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                    activeTab === 'historial'
                      ? 'bg-[#262a35] text-[#dfe2f1] shadow-md'
                      : 'text-[#d8c3ad] hover:text-[#dfe2f1]'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Historial ({historyItems.length})</span>
                </button>
              </nav>

              {/* TAB CONTENT 1: EN JUEGO */}
              {activeTab === 'en_juego' && (
                <div className="flex flex-col gap-4">
                  {/* Live Outbid Critical Banner (if outbid) */}
                  {outbidAuction.status === 'outbid' && (
                    <aside className="relative p-3 rounded-xl bg-gradient-to-r from-[#93000a]/50 via-[#1c1f2a] to-[#1c1f2a] border border-[#ff938c]/30 shadow-[0_0_20px_-2px_rgba(239,68,68,0.25)] flex items-start gap-3 overflow-hidden">
                      <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-[#93000a]/20 blur-xl pointer-events-none" />
                      <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-[#93000a] flex items-center justify-center text-[#ffdad6]">
                        <AlertTriangle className="w-4 h-4 animate-bounce" />
                      </div>
                      <div className="flex-1 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold tracking-wider text-[#ffb4ab] uppercase">
                            SUPERADO EN SUBASTA
                          </span>
                          <span className="text-xs font-mono font-bold text-[#ffbcb7]">
                            Restan {Math.floor(outbidAuction.timeLeft / 60)}m
                          </span>
                        </div>
                        <p className="text-xs text-[#dfe2f1] leading-snug">
                          {outbidAuction.title} requiere nueva puja para recuperar el liderazgo.
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <button
                            onClick={() => setBiddingItem(outbidAuction)}
                            className="px-3 py-1 rounded-lg bg-[#f59e0b] hover:bg-[#ffc174] text-[#0f131d] text-xs font-bold shadow-sm active:scale-95 transition-all flex items-center gap-1"
                          >
                            <Gavel className="w-3.5 h-3.5" />
                            <span>Pujar 68.000 Coins</span>
                          </button>
                          <button
                            onClick={() => setIsLotDetailsOpen(true)}
                            className="px-2 py-1 text-[#d8c3ad] hover:text-white text-[11px] underline"
                          >
                            Ver lote
                          </button>
                        </div>
                      </div>
                    </aside>
                  )}

                  {/* CARD 1: Rifa Activa Lotería Nacional (Moto Yamaha MT-03 2024 0km) */}
                  {showRaffle && (
                    <article className="p-3.5 rounded-xl bg-[#1c1f2a] border border-white/10 flex flex-col gap-3 shadow-lg relative overflow-hidden">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-lg bg-[#262a35] overflow-hidden border border-white/10 relative flex-shrink-0">
                            <img
                              src={raffle.image}
                              alt={raffle.title}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute bottom-0 inset-x-0 bg-[#0f131d]/90 text-[9px] font-bold text-center text-[#ffc174] uppercase py-0.5">
                              RIFA
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                              <span className="px-2 py-0.5 rounded-full bg-[#4edea3]/15 border border-[#4edea3]/30 text-[#4edea3] text-[10px] font-bold flex items-center gap-1">
                                <Verified className="w-3 h-3" />
                                <span>Auditada • Sorteo {raffle.drawDate}</span>
                              </span>
                            </div>
                            <h2 className="text-[15px] font-bold text-[#dfe2f1] leading-tight">
                              {raffle.title}
                            </h2>
                            <span className="text-[11px] text-[#d8c3ad]">{raffle.subtitle}</span>
                          </div>
                        </div>
                      </div>

                      {/* Números Comprados (Troquel) */}
                      <div className="p-2.5 rounded-lg bg-[#171b26] border border-white/5 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-[#d8c3ad]">
                            MIS TICKETS ASIGNADOS ({raffle.assignedTickets.length})
                          </span>
                          <button
                            onClick={() => setIsAuditOpen(true)}
                            className="text-[#ffc174] hover:underline text-[11px] flex items-center gap-1 font-semibold"
                          >
                            <Fingerprint className="w-3.5 h-3.5" />
                            <span>SHA-256</span>
                          </button>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 font-mono text-xs">
                          {raffle.assignedTickets.slice(0, 4).map((ticket, idx) => (
                            <div
                              key={idx}
                              className="p-1 rounded bg-[#262a35] text-center border border-[#ffc174]/40 text-[#ffc174] text-[12px] font-bold"
                            >
                              {ticket}
                            </div>
                          ))}
                        </div>
                        {raffle.assignedTickets.length > 4 && (
                          <div className="flex flex-wrap gap-1 mt-1 font-mono text-[11px]">
                            {raffle.assignedTickets.slice(4).map((t, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 rounded bg-[#262a35] text-[#ffc174] border border-[#ffc174]/20"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex justify-between items-center text-[11px] text-[#d8c3ad]">
                          <span>Probabilidad acumulada:</span>
                          <span className="font-mono text-[#4edea3] font-bold">
                            {((raffle.assignedTickets.length / raffle.totalTickets) * 100).toFixed(
                              2
                            )}
                            % ({raffle.assignedTickets.length} / {raffle.totalTickets.toLocaleString('es-AR')})
                          </span>
                        </div>
                      </div>

                      {/* Barra de Progreso de Rifa */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-[#d8c3ad]">Avance de Emisión:</span>
                          <span className="font-mono text-[#dfe2f1] font-semibold">
                            {raffle.emittedTickets.toLocaleString('es-AR')} /{' '}
                            {raffle.totalTickets.toLocaleString('es-AR')}{' '}
                            <span className="text-[#f59e0b]">
                              ({Math.round((raffle.emittedTickets / raffle.totalTickets) * 100)}%)
                            </span>
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#262a35] overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#4edea3] to-[#f59e0b] rounded-full transition-all duration-500"
                            style={{
                              width: `${(raffle.emittedTickets / raffle.totalTickets) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="flex items-center justify-between pt-1 border-t border-white/5">
                        <span className="text-[11px] text-[#d8c3ad] flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5 text-[#4edea3]" />
                          <span>Smart Contract Seguro</span>
                        </span>
                        <button
                          onClick={() => setIsBuyTicketsOpen(true)}
                          className="px-3 py-1.5 rounded-lg bg-[#262a35] hover:bg-[#353944] text-[#ffc174] text-xs font-bold flex items-center gap-1 transition-colors active:scale-95"
                        >
                          <span>Comprar +Tickets</span>
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </article>
                  )}

                  {/* CARD 2: Subasta Activa - Puja Líder (iPhone 16 Pro Max 256GB) */}
                  {auctionsList
                    .filter((a) => a.id === 'auction-iphone')
                    .map((item) => (
                      <article
                        key={item.id}
                        className="p-3.5 rounded-xl bg-[#1c1f2a] border border-[#4edea3]/40 flex flex-col gap-3 shadow-[0_0_24px_-4px_rgba(16,185,129,0.18)] relative overflow-hidden"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-14 h-14 rounded-lg bg-[#262a35] overflow-hidden border border-white/10 relative flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute bottom-0 inset-x-0 bg-[#4edea3] text-[#003824] text-[8px] font-extrabold text-center uppercase py-0.5">
                              LÍDER
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="px-2 py-0.5 rounded-full bg-[#4edea3]/20 text-[#4edea3] text-[10px] font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse" />
                                <span>Sos la Puja Más Alta</span>
                              </span>
                              <span className="font-mono text-[#ffc174] font-bold text-xs flex items-center gap-1">
                                <Timer className="w-3.5 h-3.5" />
                                <span>{formatTimer(item.timeLeft)}</span>
                              </span>
                            </div>
                            <h2 className="text-[15px] font-bold text-[#dfe2f1] mt-1 leading-tight">
                              {item.title}
                            </h2>
                            <span className="text-[11px] text-[#d8c3ad]">{item.subtitle}</span>
                          </div>
                        </div>

                        {/* Telemetría Financiera y Escrow */}
                        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-[#171b26] border border-white/5">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[#d8c3ad] block">
                              TU PUJA RETENIDA
                            </span>
                            <div className="flex items-baseline gap-1 mt-0.5">
                              <span className="font-mono text-lg font-bold text-[#ffc174]">
                                {item.userBid.toLocaleString('es-AR')}
                              </span>
                              <span className="text-[10px] font-bold text-[#d8c3ad]">COINS</span>
                            </div>
                            <span className="text-[10px] text-[#d8c3ad] block">
                              ≈ ${(item.userBid * 10).toLocaleString('es-AR')} ARS
                            </span>
                          </div>
                          <div className="border-l border-white/10 pl-2">
                            <span className="text-[10px] uppercase font-bold text-[#d8c3ad] block">
                              RESERVA DEL VENDEDOR
                            </span>
                            <div className="flex items-center gap-1 mt-1 text-[#4edea3] font-mono text-xs font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Superada (30k)</span>
                            </div>
                            <span className="text-[10px] text-[#4edea3]/80 block">
                              Adjudicación directa
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-[#d8c3ad] px-1">
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#4edea3]" />
                            <span>Escrow ArenaShield™ Activo</span>
                          </span>
                          <span className="text-[#f59e0b] font-medium font-mono">
                            Auto-puja hasta: {item.autoBidMax?.toLocaleString('es-AR')}
                          </span>
                        </div>
                      </article>
                    ))}

                  {/* CARD 3: Subasta Activa - Puja Superada / Re-puja Inmediata (MacBook Pro 14" M3 Pro) */}
                  {auctionsList
                    .filter((a) => a.id === 'auction-macbook')
                    .map((item) => (
                      <article
                        key={item.id}
                        className="p-3.5 rounded-xl bg-[#1c1f2a] border border-white/15 flex flex-col gap-3 shadow-md relative overflow-hidden"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-14 h-14 rounded-lg bg-[#262a35] overflow-hidden border border-white/10 relative flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute bottom-0 inset-x-0 bg-[#93000a] text-[#ffdad6] text-[8px] font-bold text-center uppercase py-0.5">
                              SUPERADO
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="px-2 py-0.5 rounded-full bg-[#93000a]/30 text-[#ffb4ab] text-[10px] font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-ping" />
                                <span>Puja Superada</span>
                              </span>
                              <span className="font-mono text-xs text-[#ffbcb7]">
                                Cierra en {Math.floor(item.timeLeft / 60)}m
                              </span>
                            </div>
                            <h2 className="text-[15px] font-bold text-[#dfe2f1] mt-1 leading-tight">
                              {item.title}
                            </h2>
                            <span className="text-[11px] text-[#d8c3ad]">{item.subtitle}</span>
                          </div>
                        </div>

                        {/* Duelo de Pujas */}
                        <div className="flex items-center justify-between p-2 rounded-lg bg-[#171b26] border border-white/5 font-mono text-xs">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-[#d8c3ad] block font-sans">
                              TU ÚLTIMA PUJA
                            </span>
                            <span className="text-[#dfe2f1] line-through opacity-70">
                              {item.userBid.toLocaleString('es-AR')} Coins
                            </span>
                          </div>
                          <div className="flex items-center text-[#ef4444]">
                            <TrendingUp className="w-4 h-4" />
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] uppercase font-bold text-[#4edea3] block font-sans">
                              LÍDER ({item.leaderUsername || '@GamerZone'})
                            </span>
                            <span className="text-[#ffc174] font-bold">
                              {item.highestBid.toLocaleString('es-AR')} Coins
                            </span>
                          </div>
                        </div>

                        {/* Acciones Tácticas */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => setBiddingItem(item)}
                            className="flex-1 py-2 px-3 rounded-lg bg-[#f59e0b] hover:bg-[#ffc174] text-[#0f131d] text-xs font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
                          >
                            <Plus className="w-4 h-4 stroke-[3]" />
                            <span>Pujar {(item.highestBid + item.minIncrement).toLocaleString('es-AR')} (+500)</span>
                          </button>
                          <button
                            onClick={() => handleCancelBid(item.id)}
                            className="py-2 px-2.5 rounded-lg bg-[#262a35] hover:bg-[#353944] text-[#d8c3ad] hover:text-[#ffb4ab] text-xs flex items-center justify-center border border-white/10 active:scale-95 transition-colors"
                            title="Retirar oferta retenida y desbloquear fondos en escrow"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </article>
                    ))}

                  {/* SECCIÓN PREMIO GANADO RECIENTE */}
                  {wonItems.length > 0 && (
                    <section className="mt-2 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] uppercase font-bold text-[#4edea3] flex items-center gap-1">
                          <PartyPopper className="w-4 h-4 text-[#4edea3]" />
                          <span>PREMIO GANADO RECIENTE</span>
                        </span>
                        <span className="text-xs text-[#d8c3ad]">{wonItems[0].wonDate}</span>
                      </div>

                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#1c1f2a] via-[#262a35] to-[#1c1f2a] border border-[#4edea3]/40 shadow-lg flex flex-col gap-2.5">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-lg bg-[#00a572]/20 flex-shrink-0 flex items-center justify-center border border-[#4edea3]/30 text-[#4edea3]">
                            <Trophy className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-bold text-[#dfe2f1]">
                              {wonItems[0].title}
                            </h3>
                            <p className="text-[11px] text-[#d8c3ad]">
                              Guía {wonItems[0].courier}:{' '}
                              <span className="font-mono text-[#dfe2f1] font-semibold">
                                {wonItems[0].trackingNumber}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Tracking status bar */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/10">
                          <div className="flex items-center gap-1.5 text-xs text-[#4edea3]">
                            <Truck className="w-4 h-4" />
                            <span>{wonItems[0].status}</span>
                          </div>
                          <button
                            onClick={() => setTrackingItem(wonItems[0])}
                            className="px-2.5 py-1 rounded bg-[#4edea3]/15 hover:bg-[#4edea3]/25 text-[#4edea3] text-xs font-bold uppercase tracking-wider transition-all active:scale-95"
                          >
                            Seguir Envío
                          </button>
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Trust Footer Guarantee Note */}
                  <div className="mt-2 p-3 rounded-xl bg-[#0a0e18] border border-white/10 flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-[#ffc174] flex-shrink-0" />
                    <div className="text-[11px] leading-tight text-[#d8c3ad]">
                      <strong className="text-[#dfe2f1] block">Garantía Total de Custodia</strong>
                      Las monedas retenidas se devuelven al instante a tu Wallet si otro usuario supera tu oferta.
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT 2: GANADAS */}
              {activeTab === 'ganadas' && (
                <div className="flex flex-col gap-3 animate-in fade-in">
                  <div className="p-3 rounded-xl bg-[#171b26] border border-[#4edea3]/30 flex items-center gap-2 text-xs text-[#4edea3]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Lotes adjudicados con protección y despacho postal asegurado.</span>
                  </div>

                  {wonItems.map((item) => (
                    <article
                      key={item.id}
                      className="p-4 rounded-xl bg-[#1c1f2a] border border-[#4edea3]/40 flex flex-col gap-3 shadow-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-[#00a572]/20 flex items-center justify-center text-[#4edea3]">
                            <Trophy className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-[10px] text-[#4edea3] uppercase font-bold tracking-wider">
                              LOTE ADJUDICADO
                            </span>
                            <h3 className="text-sm font-bold text-[#dfe2f1]">{item.title}</h3>
                            <p className="text-[11px] text-[#d8c3ad]">{item.subtitle}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-[#171b26] border border-white/5 space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-[#a08e7a]">Guía Oficial {item.courier}:</span>
                          <span className="font-mono text-[#ffc174] font-bold">
                            {item.trackingNumber}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#a08e7a]">Fecha de Adjudicación:</span>
                          <span className="text-[#dfe2f1]">{item.wonDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#a08e7a]">Valor Liquidado:</span>
                          <span className="font-mono text-[#4edea3] font-bold">
                            {item.valueCoins.toLocaleString('es-AR')} Coins
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => setTrackingItem(item)}
                          className="flex-1 py-2 rounded-lg bg-[#4edea3] text-[#003824] font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Seguir Envío Postal</span>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* TAB CONTENT 3: HISTORIAL */}
              {activeTab === 'historial' && (
                <div className="flex flex-col gap-3 animate-in fade-in">
                  <div className="flex justify-between items-center text-xs text-[#d8c3ad] px-1">
                    <span>Registro histórico de pujas y tickets pasados</span>
                    <span className="font-mono font-bold text-[#dfe2f1]">
                      {historyItems.length} registros
                    </span>
                  </div>

                  <div className="space-y-2">
                    {historyItems.map((hist) => (
                      <div
                        key={hist.id}
                        className="p-3 rounded-xl bg-[#1c1f2a] border border-white/5 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              hist.outcome === 'ganado'
                                ? 'bg-[#4edea3]/20 text-[#4edea3]'
                                : hist.refunded
                                ? 'bg-[#f59e0b]/20 text-[#ffc174]'
                                : 'bg-[#262a35] text-[#a08e7a]'
                            }`}
                          >
                            {hist.outcome === 'ganado' ? (
                              <Trophy className="w-4 h-4" />
                            ) : hist.refunded ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <History className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-[#dfe2f1] text-xs">{hist.title}</h4>
                            <div className="flex items-center gap-2 text-[10px] text-[#a08e7a] mt-0.5">
                              <span>{hist.date}</span>
                              <span>•</span>
                              <span
                                className={
                                  hist.outcome === 'ganado'
                                    ? 'text-[#4edea3] font-semibold'
                                    : hist.refunded
                                    ? 'text-[#f59e0b]'
                                    : 'text-[#a08e7a]'
                                }
                              >
                                {hist.escrowStatus}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right font-mono">
                          <span
                            className={`text-xs font-bold block ${
                              hist.outcome === 'ganado'
                                ? 'text-[#4edea3]'
                                : hist.refunded
                                ? 'text-[#ffc174]'
                                : 'text-[#dfe2f1]'
                            }`}
                          >
                            {hist.coins.toLocaleString('es-AR')}
                          </span>
                          <span className="text-[10px] text-[#a08e7a]">Coins</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* SCREEN 2: INICIO / EXPLORAR */}
          {(navTab === 'inicio' || navTab === 'explorar') && (
            <ExploreView
              onSelectAuction={(auc) => {
                setBiddingItem({
                  id: auc.id,
                  type: 'auction',
                  title: auc.title,
                  subtitle: auc.subtitle,
                  image: auc.image,
                  status: 'outbid',
                  userBid: auc.currentBid,
                  userBidArs: auc.currentBid * 10,
                  highestBid: auc.currentBid,
                  reservePrice: auc.currentBid,
                  reserveMet: true,
                  timeLeft: 3600,
                  escrowProtected: true,
                  minIncrement: 500,
                });
              }}
              onSelectRaffle={() => {
                setIsBuyTicketsOpen(true);
              }}
            />
          )}

          {/* SCREEN 3: WALLET */}
          {navTab === 'wallet' && (
            <WalletView
              balance={walletBalance}
              lockedInEscrow={lockedInEscrow}
              onRecharge={(coins) => {
                setWalletBalance((prev) => prev + coins);
                showToast(`¡Recarga exitosa de ${coins.toLocaleString('es-AR')} Coins!`);
              }}
            />
          )}
        </div>

        {/* Bottom Navigation Bar */}
        <BottomNavBar
          currentTab={navTab}
          onSelectTab={(tab) => {
            if (tab === 'publicar') {
              setIsPublishOpen(true);
            } else {
              setNavTab(tab);
            }
          }}
          activeItemsCount={totalActiveCount}
        />

        {/* MODALS */}
        {biddingItem && (
          <BiddingModal
            item={biddingItem}
            walletBalance={walletBalance}
            onClose={() => setBiddingItem(null)}
            onPlaceBid={handlePlaceBid}
          />
        )}

        {isBuyTicketsOpen && (
          <BuyTicketsModal
            raffle={raffle}
            walletBalance={walletBalance}
            onClose={() => setIsBuyTicketsOpen(false)}
            onBuyTickets={handleBuyTickets}
          />
        )}

        {isAuditOpen && (
          <CryptoAuditModal raffle={raffle} onClose={() => setIsAuditOpen(false)} />
        )}

        {trackingItem && (
          <ShipmentTrackingModal item={trackingItem} onClose={() => setTrackingItem(null)} />
        )}

        {isLotDetailsOpen && (
          <LotDetailsModal
            item={outbidAuction}
            onClose={() => setIsLotDetailsOpen(false)}
            onOpenBid={() => {
              setIsLotDetailsOpen(false);
              setBiddingItem(outbidAuction);
            }}
          />
        )}

        {isNotificationsOpen && (
          <NotificationsModal
            notifications={notifications}
            onClose={() => setIsNotificationsOpen(false)}
            onMarkAllAsRead={() => {
              setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            }}
            onClear={() => setNotifications([])}
          />
        )}

        {isFilterOpen && (
          <FilterModal
            selectedFilter={filterMode}
            onSelectFilter={(mode) => setFilterMode(mode)}
            onClose={() => setIsFilterOpen(false)}
          />
        )}

        {isPublishOpen && (
          <PublishModal
            onClose={() => setIsPublishOpen(false)}
            onPublishSuccess={(item) => {
              showToast(`Lote "${item.title}" publicado con custodia verificada.`);
            }}
          />
        )}
      </div>
    </div>
  );
}
