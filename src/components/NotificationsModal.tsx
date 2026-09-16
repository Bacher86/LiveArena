import React from 'react';
import { X, Bell, AlertTriangle, CheckCircle2, Info, CheckCheck } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationsModalProps {
  notifications: AppNotification[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onClear: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  notifications,
  onClose,
  onMarkAllAsRead,
  onClear,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#1c1f2a] border border-white/10 rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/20 flex items-center justify-center text-[#ffc174]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#dfe2f1]">Notificaciones</h3>
              <p className="text-xs text-[#d8c3ad]">Alertas de subastas y tickets en vivo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#262a35] text-[#dfe2f1] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action bar */}
        <div className="flex justify-between items-center py-2 text-xs">
          <button
            onClick={onMarkAllAsRead}
            className="text-[#ffc174] hover:underline flex items-center gap-1 font-semibold"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Marcar todas como leídas</span>
          </button>
          <button onClick={onClear} className="text-[#a08e7a] hover:text-white">
            Limpiar todo
          </button>
        </div>

        {/* Notifications list */}
        <div className="space-y-2.5 my-2">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#a08e7a]">
              No tienes notificaciones pendientes.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                  !notif.read
                    ? 'bg-[#171b26] border-[#f59e0b]/40 shadow-sm'
                    : 'bg-[#12151f] border-white/5 opacity-80'
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {notif.type === 'warning' && (
                    <div className="w-7 h-7 rounded-lg bg-[#93000a]/30 text-[#ffb4ab] flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  )}
                  {notif.type === 'success' && (
                    <div className="w-7 h-7 rounded-lg bg-[#00a572]/20 text-[#4edea3] flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                  {notif.type === 'info' && (
                    <div className="w-7 h-7 rounded-lg bg-[#262a35] text-[#ffc174] flex items-center justify-center">
                      <Info className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#dfe2f1]">{notif.title}</h4>
                    <span className="text-[10px] text-[#a08e7a] font-mono">{notif.timeAgo}</span>
                  </div>
                  <p className="text-[11px] text-[#d8c3ad] mt-0.5 leading-snug">{notif.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2.5 rounded-xl bg-[#262a35] hover:bg-[#353944] text-[#dfe2f1] font-bold text-xs transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
