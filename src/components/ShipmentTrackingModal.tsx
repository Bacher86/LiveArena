import React, { useState } from 'react';
import { X, Truck, Package, MapPin, CheckCircle2, Clock, Copy, Check } from 'lucide-react';
import { WonItem } from '../types';

interface ShipmentTrackingModalProps {
  item: WonItem;
  onClose: () => void;
}

export const ShipmentTrackingModal: React.FC<ShipmentTrackingModalProps> = ({ item, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(item.trackingNumber.replace('#', ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      title: 'Lote Ganado & Fondos Escrow Verificados',
      desc: 'Subasta finalizada exitosamente con respaldo ArenaShield™',
      date: '14 Feb - 21:05 hs',
      done: true,
    },
    {
      title: 'Embalado con Precinto Holográfico',
      desc: 'Inspección de producto sellado y packaging de seguridad',
      date: '15 Feb - 09:30 hs',
      done: true,
    },
    {
      title: 'Ingreso a Planta Logística Andreani (Pacheco)',
      desc: 'En tránsito hacia la ciudad de destino',
      date: '15 Feb - 18:45 hs',
      done: true,
    },
    {
      title: 'En Camino a Sucursal de Retiro (Belgrano)',
      desc: 'Unidad de transporte #TX-409 en recorrido de distribución',
      date: 'Hoy - 07:15 hs',
      done: true,
      current: true,
    },
    {
      title: 'Disponible para Retiro con Código Seguro',
      desc: 'Sucursal Andreani: Av. Cabildo 2040, CABA',
      date: 'Estimado: Mañana 14:00 hs',
      done: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#1c1f2a] border border-white/10 rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#4edea3]/20 flex items-center justify-center text-[#4edea3]">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#dfe2f1]">Seguimiento de Envío</h3>
              <p className="text-xs text-[#d8c3ad]">Operador Logístico: {item.courier}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#262a35] text-[#dfe2f1] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product preview */}
        <div className="my-4 p-3 rounded-xl bg-[#171b26] border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#4edea3] block">
              Premio Verificado
            </span>
            <h4 className="text-sm font-bold text-[#dfe2f1]">{item.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-xs text-[#ffc174] font-bold">
                {item.trackingNumber}
              </span>
              <button
                onClick={handleCopy}
                className="text-[11px] text-[#d8c3ad] hover:text-white flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-[#4edea3]" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-[#4edea3]/15 border border-[#4edea3]/30 text-[#4edea3] text-[10px] font-bold uppercase tracking-wider">
            {item.status}
          </div>
        </div>

        {/* Claim code */}
        <div className="p-3 rounded-xl bg-[#0a0e18] border border-white/5 mb-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#d8c3ad] block">
              Código de Adjudicación / Retiro
            </span>
            <span className="font-mono text-sm text-[#ffc174] font-bold tracking-wider">
              {item.claimCode}
            </span>
          </div>
          <div className="text-[10px] text-[#a08e7a] text-right">
            Presentar con DNI al momento de retirar
          </div>
        </div>

        {/* Timeline */}
        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              {/* Dot */}
              <div
                className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  step.current
                    ? 'bg-[#f59e0b] border-[#ffc174] shadow-[0_0_12px_rgba(245,158,11,0.8)]'
                    : step.done
                    ? 'bg-[#4edea3] border-[#0f131d]'
                    : 'bg-[#262a35] border-white/20'
                }`}
              >
                {step.done && !step.current && (
                  <CheckCircle2 className="w-2.5 h-2.5 text-[#0f131d]" />
                )}
              </div>
              <div className="text-xs">
                <div className="flex items-center justify-between">
                  <span
                    className={`font-bold ${
                      step.current
                        ? 'text-[#ffc174]'
                        : step.done
                        ? 'text-[#dfe2f1]'
                        : 'text-[#a08e7a]'
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className="text-[10px] text-[#a08e7a] font-mono">{step.date}</span>
                </div>
                <p className="text-[#d8c3ad] text-[11px] mt-0.5 leading-snug">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 rounded-xl bg-[#262a35] hover:bg-[#353944] text-[#dfe2f1] font-bold text-xs transition-colors"
        >
          Cerrar Seguimiento
        </button>
      </div>
    </div>
  );
};
