export type ActiveTab = 'en_juego' | 'ganadas' | 'historial';
export type NavTab = 'inicio' | 'explorar' | 'publicar' | 'mis_cosas' | 'wallet';

export interface RaffleTicket {
  id: string;
  number: string;
  hash: string;
  assignedAt: string;
}

export interface RaffleItem {
  id: string;
  type: 'raffle';
  title: string;
  subtitle: string;
  drawDate: string;
  audited: boolean;
  image: string;
  assignedTickets: string[];
  totalTickets: number;
  emittedTickets: number;
  ticketPriceCoins: number;
  sha256Proof: string;
}

export interface AuctionItem {
  id: string;
  type: 'auction';
  title: string;
  subtitle: string;
  image: string;
  status: 'leader' | 'outbid' | 'won' | 'closed';
  userBid: number;
  userBidArs: number;
  highestBid: number;
  leaderUsername?: string;
  reservePrice: number;
  reserveMet: boolean;
  timeLeft: number; // in seconds
  autoBidMax?: number;
  escrowProtected: boolean;
  minIncrement: number;
}

export interface WonItem {
  id: string;
  title: string;
  subtitle: string;
  wonDate: string;
  trackingNumber: string;
  courier: string;
  status: 'En preparación' | 'Despachado' | 'En camino a sucursal' | 'Entregado';
  estimatedArrival: string;
  claimCode: string;
  valueCoins: number;
  image?: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  type: 'subasta' | 'rifa';
  date: string;
  outcome: 'ganado' | 'superado_reembolsado' | 'no_ganador';
  coins: number;
  refunded: boolean;
  escrowStatus: 'Liberado' | 'Reembolsado al instante' | 'Transferido';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
  type: 'warning' | 'success' | 'info';
}
