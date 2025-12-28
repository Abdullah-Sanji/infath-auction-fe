export interface AuctionStats {
  bidsCount: number;
  viewsCount: number;
  participantsCount: number;
}

export interface AuctionInfo {
  auctionType: string;
  assetType: string;
}

export interface BoundaryDetail {
  direction: string;
  description: string;
  icon?: string;
}

export interface OwnershipInfo {
  propertyArea: string;
  ownershipType: string;
  ownershipRights: string;
}

export interface AssetInfo {
  planNumber: string;
  plotNumber: string;
  propertyFacing: string;
  propertyUsage: string;
  propertyLocation: string;
  landType: string;
  deedNumber: string;
  deedDate: string;
  propertyArea: string;
}

export interface ResidentialDetails {
  roomsCount: number;
  hallsCount: number;
  bathroomsCount: number;
  kitchensCount: number;
  buildingAge: string;
}

export interface PublicService {
  name: string;
  icon: string;
}

export interface NeighborhoodService {
  name: string;
  distance: string;
  icon: string;
}

export interface SellerReview {
  sellerName: string;
  sellerImage: string;
  isVerified: boolean;
  overallRating: number;
  accuracyRating: number;
  communicationRating: number;
}

export interface AccordionState {
  boundaries: boolean;
  ownership: boolean;
  assetInfo: boolean;
  residentialDetails: boolean;
  publicServices: boolean;
  neighborhoodServices: boolean;
}

export interface BidHistoryItem {
  amount: number;
  timeAgo: string;
  isHighest: boolean;
}

export interface AuctionCardInfo {
  openingPrice: number;
  entryAmount: number;
  highestPrice: number;
  depositAmount: number;
  currentHighestBid: number;
  timeRemaining: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  status: 'live' | 'upcoming' | 'closed';
  bidHistory: BidHistoryItem[];
}

export interface AuctionDetails {
  id: string;
  title: string;
  stats: AuctionStats;
  info: AuctionInfo;
  boundaries: BoundaryDetail[];
  ownership: OwnershipInfo;
  assetInfo: AssetInfo;
  residentialDetails: ResidentialDetails;
  publicServices: PublicService[];
  neighborhoodServices: NeighborhoodService[];
  sellerReview: SellerReview;
  images: string[];
  mainImage: string;
  auctionCard: AuctionCardInfo;
}
