export interface AuctionSummary {
  id: string;
  title: string;
  currentBid: number;
  endDate: string;
  imageUrl: string;
}

export interface HomeData {
  featuredAuctions: AuctionSummary[];
  totalAuctions: number;
  activeUsers: number;
}
