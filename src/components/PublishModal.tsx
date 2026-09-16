import React, { useState } from 'react';
import { X, Plus, ShieldCheck, Tag, DollarSign, Calendar, UploadCloud, CheckCircle2 } from 'lucide-react';

interface PublishModalProps {
  onClose: () => void;
  onPublishSuccess: (item: any) => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({ onClose, onPublishSuccess }) => {
  const [lotType, setLotType] = useState<'subasta' | 'rifa'>('subasta');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [startingPrice, setStartingPrice] = useState(10000);
  const [reservePrice, setReservePrice] = useState(15000);
  const [duration, setDuration] = useState('24h');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      onPublishSuccess({
        id: `custom-${Date.now()}`,
        type: lotType,
        title: title || 'Nuevo Lote en Custodia',
        subtitle: subtitle || 'Sellado Oficial con Garantía ArenaLive',
        startingPrice,
      });
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#1c1f2a] border border-white/10 rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/20 flex items-center justify-center text-[#ffc174]">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#dfe2f1]">Publicar en ArenaLive</h3>
              <p className="text-xs text-[#d8c3ad]">Con custodia garantizada ArenaShield™</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#262a35] text-[#dfe2f1] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#4edea3]/20 flex items-center justify-center text-[#4edea3] animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-[#dfe2f1]">¡Lote Publicado Exitosamente!</h4>
            <p className="text-xs text-[#d8c3ad] max-w-xs">
              Tu publicación ha sido registrada y el contrato de custodia escrow se encuentra activo.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 my-3">
            {/* Format toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#171b26] rounded-xl">
              <button
                type="button"
                onClick={() => setLotType('subasta')}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  lotType === 'subasta'
                    ? 'bg-[#f59e0b] text-[#0f131d] shadow-sm'
                    : 'text-[#d8c3ad] hover:text-[#dfe2f1]'
                }`}
              >
                Subasta con Reserva
              </button>
              <button
                type="button"
                onClick={() => setLotType('rifa')}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  lotType === 'rifa'
                    ? 'bg-[#f59e0b] text-[#0f131d] shadow-sm'
                    : 'text-[#d8c3ad] hover:text-[#dfe2f1]'
                }`}
              >
                Rifa con Lotería Oficial
              </button>
            </div>

            {/* Inputs */}
            <div>
              <label className="text-xs font-bold text-[#dfe2f1] block mb-1">
                Título del Producto o Lote
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Sony PlayStation 5 Pro 2TB / iPhone 16"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-10 bg-[#171b26] border border-white/10 rounded-xl px-3 text-xs text-[#dfe2f1] focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#dfe2f1] block mb-1">
                Subtítulo y Estado
              </label>
              <input
                type="text"
                placeholder="Ej: Sellado en caja • Factura oficial y garantía"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full h-10 bg-[#171b26] border border-white/10 rounded-xl px-3 text-xs text-[#dfe2f1] focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#dfe2f1] block mb-1">
                  {lotType === 'subasta' ? 'Precio Base (Coins)' : 'Precio por Ticket'}
                </label>
                <input
                  type="number"
                  min={500}
                  value={startingPrice}
                  onChange={(e) => setStartingPrice(Number(e.target.value))}
                  className="w-full h-10 bg-[#171b26] border border-white/10 rounded-xl px-3 text-xs font-mono font-bold text-[#ffc174] focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#dfe2f1] block mb-1">
                  {lotType === 'subasta' ? 'Precio Reserva (Mínimo)' : 'Total de Tickets'}
                </label>
                <input
                  type="number"
                  min={1000}
                  value={reservePrice}
                  onChange={(e) => setReservePrice(Number(e.target.value))}
                  className="w-full h-10 bg-[#171b26] border border-white/10 rounded-xl px-3 text-xs font-mono font-bold text-[#4edea3] focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
                />
              </div>
            </div>

            {/* Escrow guarantee */}
            <div className="p-3 rounded-xl bg-[#0a0e18] border border-[#4edea3]/20 flex items-start gap-2 text-xs text-[#d8c3ad]">
              <ShieldCheck className="w-4 h-4 text-[#4edea3] flex-shrink-0 mt-0.5" />
              <span>
                Al publicar aceptas el protocolo de custodia: el pago de los compradores se retiene
                en escrow hasta que confirmes la entrega o despacho postal seguro.
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#f59e0b] hover:bg-[#ffc174] text-[#0f131d] font-bold text-xs shadow-lg transition-all active:scale-95"
            >
              Confirmar y Crear Lote
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
