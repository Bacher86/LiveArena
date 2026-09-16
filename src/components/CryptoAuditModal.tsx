import React, { useState } from 'react';
import { X, ShieldCheck, Fingerprint, Copy, Check, ExternalLink } from 'lucide-react';
import { RaffleItem } from '../types';

interface CryptoAuditModalProps {
  raffle: RaffleItem;
  onClose: () => void;
}

export const CryptoAuditModal: React.FC<CryptoAuditModalProps> = ({ raffle, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(raffle.sha256Proof);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#1c1f2a] border border-white/10 rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ffc174]/20 flex items-center justify-center text-[#ffc174]">
              <Fingerprint className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#dfe2f1]">Auditoría Criptográfica</h3>
              <p className="text-xs text-[#d8c3ad]">Provably Fair SHA-256</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#262a35] text-[#dfe2f1] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Verification badge */}
        <div className="my-4 p-3 rounded-xl bg-[#0a0e18] border border-[#4edea3]/30 flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-[#4edea3] flex-shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-[#4edea3] block">Contrato Verificado & Inmutable</span>
            <span className="text-[#d8c3ad]">
              El sorteo se liquida con el extracto oficial de la Lotería Nacional Nocturna del 28 Feb.
            </span>
          </div>
        </div>

        {/* Seeds & Hashes */}
        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 rounded-lg bg-[#171b26] border border-white/5">
            <span className="text-[10px] text-[#a08e7a] uppercase block font-sans font-bold mb-1">
              Hash Raíz SHA-256 Pre-comprometido
            </span>
            <p className="text-[#ffc174] break-all leading-relaxed">{raffle.sha256Proof}</p>
            <button
              onClick={handleCopy}
              className="mt-2 flex items-center gap-1.5 text-[11px] text-[#4edea3] hover:underline font-sans font-semibold"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '¡Copiado al portapapeles!' : 'Copiar Hash de Verificación'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg bg-[#171b26] border border-white/5">
              <span className="text-[10px] text-[#a08e7a] uppercase block font-sans font-bold">
                Semilla Servidor
              </span>
              <span className="text-[#dfe2f1] text-[11px] truncate block">
                0x7f8a92b1cd4e5f09
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#171b26] border border-white/5">
              <span className="text-[10px] text-[#a08e7a] uppercase block font-sans font-bold">
                Bloque Ethereum
              </span>
              <span className="text-[#dfe2f1] text-[11px] block">#20,941,833</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#171b26] border border-white/5">
            <span className="text-[10px] text-[#a08e7a] uppercase block font-sans font-bold mb-1">
              Algoritmo de Determinación
            </span>
            <p className="text-[#d8c3ad] font-sans text-xs leading-relaxed">
              Ganador = (Lotería Nacional Nocturna N° 1 % Total de Tickets) = Índice Ganador. La
              asignación es pública, descentralizada y no puede ser manipulada por ArenaLive.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 rounded-xl bg-[#262a35] hover:bg-[#353944] text-[#dfe2f1] font-bold text-xs transition-colors"
        >
          Cerrar Auditoría
        </button>
      </div>
    </div>
  );
};
