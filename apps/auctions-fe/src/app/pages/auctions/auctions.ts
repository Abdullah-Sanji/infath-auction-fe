import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Auction {
  id: number;
  title: string;
  description: string;
  currentBid: number;
  endDate: Date;
  imageUrl: string;
}

@Component({
  selector: 'app-auctions',
  imports: [CommonModule],
  templateUrl: './auctions.html',
  styleUrl: './auctions.scss',
})
export class Auctions {
  protected readonly auctions = signal<Auction[]>([
    {
      id: 1,
      title: 'Vintage Watch Collection',
      description: 'A stunning collection of vintage watches from the 1960s',
      currentBid: 1250,
      endDate: new Date(2025, 10, 30),
      imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=300&fit=crop',
    },
    {
      id: 2,
      title: 'Modern Art Painting',
      description: 'Abstract expressionist painting by emerging artist',
      currentBid: 850,
      endDate: new Date(2025, 10, 28),
      imageUrl: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400&h=300&fit=crop',
    },
    {
      id: 3,
      title: 'Antique Furniture Set',
      description: 'Victorian-era mahogany dining set in excellent condition',
      currentBid: 3200,
      endDate: new Date(2025, 11, 1),
      imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
    },
    {
      id: 4,
      title: 'Rare Book Collection',
      description: 'First edition novels from renowned authors',
      currentBid: 680,
      endDate: new Date(2025, 10, 29),
      imageUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=300&fit=crop',
    },
    {
      id: 5,
      title: 'Classic Camera Equipment',
      description: 'Professional photography gear from the golden age',
      currentBid: 1450,
      endDate: new Date(2025, 11, 2),
      imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop',
    },
    {
      id: 6,
      title: 'Designer Handbag',
      description: 'Limited edition luxury handbag with authenticity certificate',
      currentBid: 2100,
      endDate: new Date(2025, 10, 27),
      imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=300&fit=crop',
    },
  ]);
}
