import React, { useState } from 'react';
import { Wallet, ShieldCheck, ArrowUpRight, ArrowDownLeft, RefreshCw, PlusCircle, CheckCircle2, Lock } from 'lucide-react';

interface WalletViewProps {
  balance: number;
  lockedInEscrow: number;
  onRecharge: (coins: number) => void;
}

export const WalletView: React.FC<WalletViewProps> = ({
  balance,
  lockedInEscrow,
  onRecharge,
}) => {
  const [rechargeAmount, setRechargeAmount] = useState<number>(25000);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  const totalNetWorth = balance + lockedInEscrow;

  const movements = [
    {
      id: 'mov-1',
      title: 'Bloqueo Escrow - Subasta iPhone 16 Pro Max',
      type: 'lock',
      amount: -34500,
      date: 'Hoy, 10:24',
      status: 'En Custodia Segura',
    },
    {
      id: 'mov-2',
      title: 'Desbloqueo Inmediato - Subasta iPad Air M2',
      type: 'refund',
      amount: +38000,
      date: '12 Feb, 18:00',
      status: 'Acreditado',
    },
    {
      id: 'mov-3',
      title: 'Compra Tickets Rifa - Yamaha MT-03',
      type: 'debit',
      amount: -4800,
      date: '10 Feb, 15:30',
      status: 'Confirmado On-Chain',
    },
    {
      id: 'mov-4',
      title: 'Recarga de Saldo por Transferencia Bancaria',
      type: 'credit',
      amount: +50000,
      date: '08 Feb, 11:15',
      status: 'Completado',
    },
  ];

  const handleRechargeSubmit = () => {
    onRecharge(rechargeAmount);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  return (
    <div className="flex flex-col gap-4 pb-20 animate-in fade-in duration-200">
      {/* Wallet Balance Hero Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1c1f2a] via-[#171b26] to-[#0a0e18] border border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#f59e0b]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#f59e0b]/20 flex items-center justify-center text-[#ffc174]">
              <Wallet className="w-4 h-4" />
            </div>
            <span className="text-xs uppercase font-bold tracking-wider text-[#d8c3ad]">
              Mi Billetera ArenaLive
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#4edea3]/15 text-[#4edea3] text-[10px] font-bold flex items-center gap-1 font-mono">
            <ShieldCheck className="w-3 h-3" /> Custodia Activa
          </span>
        </div>

        {/* Big numbers */}
        <div className="my-3">
          <span className="text-[11px] text-[#a08e7a] block font-medium">Saldo Total Acumulado</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-[#ffc174]">
              {totalNetWorth.toLocaleString('es-AR')}
            </span>
            <span className="text-xs font-bold font-mono text-[#d8c3ad]">COINS</span>
          </div>
          <span className="text-xs text-[#d8c3ad]">
            ≈ ${(totalNetWorth * 10).toLocaleString('es-AR')} ARS
          </span>
        </div>

        {/* Breakdown row */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
          <div className="p-2.5 rounded-xl bg-[#0f131d]/60 border border-white/5">
            <div className="flex items-center gap-1 text-[10px] text-[#d8c3ad] uppercase font-bold">
              <span className="w-2 h-2 rounded-full bg-[#4edea3]" />
              <span>Disponible para Pujar</span>
            </div>
            <span className="text-base font-bold font-mono text-[#4edea3] mt-0.5 block">
              {balance.toLocaleString('es-AR')}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0f131d]/60 border border-white/5">
            <div className="flex items-center gap-1 text-[10px] text-[#d8c3ad] uppercase font-bold">
              <Lock className="w-2.5 h-2.5 text-[#f59e0b]" />
              <span>Retenido en Escrow</span>
            </div>
            <span className="text-base font-bold font-mono text-[#ffc174] mt-0.5 block">
              {lockedInEscrow.toLocaleString('es-AR')}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Recharge */}
      <div className="p-4 rounded-xl bg-[#1c1f2a] border border-white/5">
        <h3 className="text-sm font-bold text-[#dfe2f1] mb-2 flex items-center gap-1.5">
          <PlusCircle className="w-4 h-4 text-[#ffc174]" />
          <span>Cargar Coins a tu Billetera</span>
        </h3>
        <p className="text-xs text-[#d8c3ad] mb-3">
          1 Coin = $10 ARS. Acreditación instantánea 24/7 sin comisiones de depósito.
        </p>

        {/* Chips */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[10000, 25000, 50000].map((amount) => (
            <button
              key={amount}
              onClick={() => setRechargeAmount(amount)}
              className={`p-2 rounded-xl text-center border font-mono text-xs transition-all ${
                rechargeAmount === amount
                  ? 'bg-[#f59e0b]/15 border-[#f59e0b] text-[#ffc174] font-bold'
                  : 'bg-[#171b26] border-white/5 text-[#dfe2f1] hover:bg-[#262a35]'
              }`}
            >
              +{amount.toLocaleString('es-AR')}
            </button>
          ))}
        </div>

        <button
          onClick={handleRechargeSubmit}
          className="w-full py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#ffc174] text-[#0f131d] font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
        >
          <span>Recargar {rechargeAmount.toLocaleString('es-AR')} Coins ($ {(rechargeAmount * 10).toLocaleString('es-AR')} ARS)</span>
        </button>

        {showSuccessToast && (
          <div className="mt-2 p-2 rounded-lg bg-[#4edea3]/20 border border-[#4edea3]/40 text-xs text-[#4edea3] flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>¡Carga exitosa! Se acreditaron los Coins en tu billetera.</span>
          </div>
        )}
      </div>

      {/* Movements Table */}
      <div className="p-4 rounded-xl bg-[#1c1f2a] border border-white/5">
        <h3 className="text-sm font-bold text-[#dfe2f1] mb-3">Historial de Movimientos & Custodia</h3>
        <div className="space-y-2">
          {movements.map((m) => (
            <div
              key={m.id}
              className="p-2.5 rounded-xl bg-[#171b26] border border-white/5 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    m.amount > 0 ? 'bg-[#4edea3]/15 text-[#4edea3]' : 'bg-[#f59e0b]/15 text-[#ffc174]'
                  }`}
                >
                  {m.amount > 0 ? (
                    <ArrowDownLeft className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-[#dfe2f1] text-xs">{m.title}</h4>
                  <span className="text-[10px] text-[#a08e7a]">{m.date} • {m.status}</span>
                </div>
              </div>
              <div className="text-right font-mono font-bold">
                <span className={m.amount > 0 ? 'text-[#4edea3]' : 'text-[#dfe2f1]'}>
                  {m.amount > 0 ? `+${m.amount.toLocaleString('es-AR')}` : m.amount.toLocaleString('es-AR')}
                </span>
                <span className="text-[10px] text-[#d8c3ad] block font-sans">Coins</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
