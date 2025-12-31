import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { Observable } from 'rxjs';
import { PaginatedResult } from '@shared/models/result';
import { Auction } from '../interfaces/auction.interface';

@Injectable()
export class AuctionsService {
  private readonly api = inject(ApiService);

  getAuctions(pageIndex: number = 1, pageSize: number = 20): Observable<PaginatedResult<Auction>> {
    return this.api.getPaginated<Auction>(
      `/auctions/api/v1/auctions?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
  }
}
