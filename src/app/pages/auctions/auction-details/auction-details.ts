import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { AuctionDetailsService } from './services/auction-details.service';
import { Breadcrumb, BreadcrumbItem } from '../../../shared/components/ui/breadcrumb/breadcrumb';
import {
  AuctionDetails as AuctionDetailsData,
  AccordionState,
  BoundaryDetail,
  PublicService,
  NeighborhoodService,
  BidHistoryItem
} from './interfaces/auction-details.interface';

@Component({
  selector: 'app-auction-details',
  imports: [
    CommonModule,
    Breadcrumb,
    TranslocoPipe
  ],
  providers: [AuctionDetailsService],
  templateUrl: './auction-details.html',
  styleUrl: './auction-details.scss',
})
export class AuctionDetails {
  // Gallery images (4 images for the 2x2 grid)
  galleryImages = signal<string[]>([
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'
  ]);

  // Main large image on the right
  mainImage = signal<string>('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop');

  // Breadcrumb items
  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'الصفحة الرئيسية', route: ['/'], translationKey: 'nav.home' },
    { label: 'مزاد 233' }
  ]);

  // Accordion states
  accordionStates = signal<AccordionState>({
    boundaries: true,
    ownership: true,
    assetInfo: true,
    residentialDetails: true,
    publicServices: true,
    neighborhoodServices: true
  });

  // Hardcoded auction details data
  auctionDetails = signal<AuctionDetailsData>({
    id: '233',
    title: 'شقة سكنية في حي الملقا',
    stats: {
      bidsCount: 65,
      viewsCount: 35,
      participantsCount: 12
    },
    info: {
      auctionType: 'إلكتروني',
      assetType: 'عقار'
    },
    boundaries: [
      {
        direction: 'شمالاً',
        description: 'شارع عرض 15 م بطول 136 متر',
        icon: 'square-arrow-up'
      },
      {
        direction: 'شرقاً',
        description: 'قطعة رقم 13 بطول 89 متر',
        icon: 'square-arrow-right'
      },
      {
        direction: 'جنوباً',
        description: 'قطعة رقم 15 وجزء من القطعة 13 بطول منكسر يبدء من الغرب 105 متر , ثم ينكسر جنوبا 12.60 متر , ثم ينكسر شرقا 27.50 متر',
        icon: 'square-arrow-down'
      },
      {
        direction: 'غرباً',
        description: 'شارع عرض 20 م بطول منكسر 48.10 متر + 17.50 متر',
        icon: 'square-arrow-left'
      }
    ],
    ownership: {
      propertyArea: '150 م٢',
      ownershipType: 'فردية',
      ownershipRights: 'حرة'
    },
    assetInfo: {
      planNumber: '3345562',
      plotNumber: '12234',
      propertyFacing: 'شرقية',
      propertyUsage: 'سكني',
      propertyLocation: 'الرياض ، حي السلام',
      landType: 'أرض سكنية',
      deedNumber: '2202070236661',
      deedDate: '26 ذي القعدة 1446 هـ، الموافق لـ 26 أكتوبر 2025 م',
      propertyArea: '150 م٢'
    },
    residentialDetails: {
      roomsCount: 3,
      hallsCount: 1,
      bathroomsCount: 2,
      kitchensCount: 1,
      buildingAge: 'جديد'
    },
    publicServices: [
      { name: 'الإنترنت : 5G, Fiber', icon: 'wifi' },
      { name: 'مصعد', icon: 'elevator' },
      { name: 'نظام التكييف: مركزي', icon: 'ac' },
      { name: 'مدخل السيارة', icon: 'parking' },
      { name: 'المياه', icon: 'water' }
    ],
    neighborhoodServices: [
      { name: 'مسجد', distance: 'على بعد 500 متر', icon: 'mosque' },
      { name: 'حديقة', distance: 'على بعد 700 متر', icon: 'garden' },
      { name: 'مستشفى / مركز صحي', distance: 'على بعد 1.2 كم', icon: 'hospital' },
      { name: 'مدرسة', distance: 'على بعد 300 متر', icon: 'school' },
      { name: 'مجمع تجاري / مول', distance: 'على بعد 900 متر', icon: 'mall' },
      { name: 'بقالة', distance: 'على بعد 200 متر', icon: 'grocery' }
    ],
    sellerReview: {
      sellerName: 'مؤسسة أرصاد العقارية',
      sellerImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
      isVerified: true,
      overallRating: 3.5,
      accuracyRating: 4,
      communicationRating: 3.5
    },
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop'
    ],
    mainImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop',
    auctionCard: {
      openingPrice: 78234233,
      entryAmount: 100234233,
      highestPrice: 200000,
      depositAmount: 100,
      currentHighestBid: 200000,
      timeRemaining: {
        days: 0,
        hours: 3,
        minutes: 40,
        seconds: 2
      },
      status: 'live',
      bidHistory: [
        { amount: 987654321, timeAgo: 'منذ ٥ دقائق', isHighest: true },
        { amount: 555666777, timeAgo: 'منذ ١٠ دقائق', isHighest: false },
        { amount: 123456789, timeAgo: 'منذ ١٥ دقيقة', isHighest: false },
        { amount: 333222111, timeAgo: 'منذ ٢٠ دقيقة', isHighest: false },
        { amount: 444555666, timeAgo: 'منذ ٢٥ دقيقة', isHighest: false },
        { amount: 777888999, timeAgo: 'منذ ٣٠ دقيقة', isHighest: false },
        { amount: 246135790, timeAgo: 'منذ ٣٥ دقيقة', isHighest: false }
      ]
    }
  });

  // Current image index for gallery
  currentImageIndex = signal(0);

  toggleAccordion(section: keyof AccordionState): void {
    const currentStates = this.accordionStates();
    this.accordionStates.set({
      ...currentStates,
      [section]: !currentStates[section]
    });
  }

  previousImage(): void {
    const images = this.auctionDetails().images;
    const currentIndex = this.currentImageIndex();
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    this.currentImageIndex.set(newIndex);

    // Update main image
    const details = this.auctionDetails();
    this.auctionDetails.set({
      ...details,
      mainImage: images[newIndex]
    });
  }

  nextImage(): void {
    const images = this.auctionDetails().images;
    const currentIndex = this.currentImageIndex();
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    this.currentImageIndex.set(newIndex);

    // Update main image
    const details = this.auctionDetails();
    this.auctionDetails.set({
      ...details,
      mainImage: images[newIndex]
    });
  }
}
