export interface Auction {
  auctionId: string;
  categoryId: string;
  title: string;
  titleAr: string;
  status: string;
  startTime: string;
  endTime: string;
  timeRemaining: string;
  categoryName: string;
  categoryNameAr: string;
  highestCurrentBid: number;
  startingPrice: number;
  totalBids: number;
  primaryImageUrl: string;
  location: string;
  locationAr: string;
  regionId: string;
  cityId: string;
  countryName: string;
  countryNameAr: string;
  cityName: string;
  cityNameAr: string;
  regionName: string;
  regionNameAr: string;
}

