import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { grafanaInterceptor } from './grafana.interceptor';
import { GrafanaService } from '../services/grafana.service';

describe('grafanaInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let grafanaService: jasmine.SpyObj<GrafanaService>;

  beforeEach(() => {
    const grafanaServiceSpy = jasmine.createSpyObj('GrafanaService', [
      'trackEvent',
      'trackPerformance',
      'trackError'
    ]);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([grafanaInterceptor])),
        provideHttpClientTesting(),
        { provide: GrafanaService, useValue: grafanaServiceSpy }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    grafanaService = TestBed.inject(GrafanaService) as jasmine.SpyObj<GrafanaService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should track successful API calls', (done) => {
    const testUrl = '/api/auctions';
    const testData = { auctions: [] };

    httpClient.get(testUrl).subscribe({
      next: (data) => {
        expect(data).toEqual(testData);

        // Verify event tracking
        expect(grafanaService.trackEvent).toHaveBeenCalledWith(
          jasmine.objectContaining({
            name: 'api_call',
            attributes: jasmine.objectContaining({
              method: 'GET',
              endpoint: testUrl,
              status: '200',
              success: 'true'
            }),
            domain: 'http'
          })
        );

        // Verify performance tracking
        expect(grafanaService.trackPerformance).toHaveBeenCalledWith(
          jasmine.objectContaining({
            name: 'api_call_duration',
            value: jasmine.any(Number),
            attributes: jasmine.objectContaining({
              method: 'GET',
              endpoint: testUrl,
              status: '200'
            })
          })
        );

        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    expect(req.request.method).toBe('GET');
    req.flush(testData);
  });

  it('should track POST requests', (done) => {
    const testUrl = '/api/bids';
    const postData = { auctionId: '123', amount: 1000 };
    const responseData = { success: true };

    httpClient.post(testUrl, postData).subscribe({
      next: () => {
        expect(grafanaService.trackEvent).toHaveBeenCalledWith(
          jasmine.objectContaining({
            name: 'api_call',
            attributes: jasmine.objectContaining({
              method: 'POST',
              endpoint: testUrl,
              status: '201',
              success: 'true'
            })
          })
        );

        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(postData);
    req.flush(responseData, { status: 201, statusText: 'Created' });
  });

  it('should track API errors', (done) => {
    const testUrl = '/api/auctions/999';
    const errorMessage = 'Not Found';

    httpClient.get(testUrl).subscribe({
      error: () => {
        // Verify error event tracking
        expect(grafanaService.trackEvent).toHaveBeenCalledWith(
          jasmine.objectContaining({
            name: 'api_call_error',
            attributes: jasmine.objectContaining({
              method: 'GET',
              endpoint: testUrl,
              status: '404',
              success: 'false'
            })
          })
        );

        // Verify error tracking
        expect(grafanaService.trackError).toHaveBeenCalledWith(
          jasmine.any(Object),
          jasmine.objectContaining({
            context: 'http_request',
            attributes: jasmine.objectContaining({
              method: 'GET',
              endpoint: testUrl,
              status: 404
            })
          })
        );

        // Verify performance still tracked for errors
        expect(grafanaService.trackPerformance).toHaveBeenCalledWith(
          jasmine.objectContaining({
            name: 'api_call_duration',
            value: jasmine.any(Number),
            attributes: jasmine.objectContaining({
              method: 'GET',
              endpoint: testUrl,
              status: '404',
              error: 'true'
            })
          })
        );

        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
  });

  it('should track 500 server errors', (done) => {
    const testUrl = '/api/error';

    httpClient.get(testUrl).subscribe({
      error: () => {
        expect(grafanaService.trackEvent).toHaveBeenCalledWith(
          jasmine.objectContaining({
            name: 'api_call_error',
            attributes: jasmine.objectContaining({
              status: '500',
              success: 'false'
            })
          })
        );

        expect(grafanaService.trackError).toHaveBeenCalled();

        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should track 401 unauthorized errors', (done) => {
    const testUrl = '/api/protected';

    httpClient.get(testUrl).subscribe({
      error: () => {
        expect(grafanaService.trackEvent).toHaveBeenCalledWith(
          jasmine.objectContaining({
            name: 'api_call_error',
            attributes: jasmine.objectContaining({
              status: '401',
              statusText: 'Unauthorized'
            })
          })
        );

        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });

  it('should track PUT requests', (done) => {
    const testUrl = '/api/auctions/123';
    const updateData = { title: 'Updated' };

    httpClient.put(testUrl, updateData).subscribe({
      next: () => {
        expect(grafanaService.trackEvent).toHaveBeenCalledWith(
          jasmine.objectContaining({
            attributes: jasmine.objectContaining({
              method: 'PUT',
              endpoint: testUrl
            })
          })
        );

        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    expect(req.request.method).toBe('PUT');
    req.flush({ success: true });
  });

  it('should track DELETE requests', (done) => {
    const testUrl = '/api/auctions/123';

    httpClient.delete(testUrl).subscribe({
      next: () => {
        expect(grafanaService.trackEvent).toHaveBeenCalledWith(
          jasmine.objectContaining({
            attributes: jasmine.objectContaining({
              method: 'DELETE',
              endpoint: testUrl
            })
          })
        );

        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true }, { status: 204, statusText: 'No Content' });
  });

  it('should track requests with query parameters', (done) => {
    const testUrl = '/api/auctions?page=1&limit=10';

    httpClient.get(testUrl).subscribe({
      next: () => {
        // Should track the endpoint without query params
        expect(grafanaService.trackEvent).toHaveBeenCalledWith(
          jasmine.objectContaining({
            attributes: jasmine.objectContaining({
              endpoint: '/api/auctions'
            })
          })
        );

        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.flush({ data: [] });
  });

  it('should track performance metrics for all requests', (done) => {
    const testUrl = '/api/slow-endpoint';

    httpClient.get(testUrl).subscribe({
      next: () => {
        expect(grafanaService.trackPerformance).toHaveBeenCalled();

        const callArgs = grafanaService.trackPerformance.calls.mostRecent().args[0];
        expect(callArgs.name).toBe('api_call_duration');
        expect(callArgs.value).toBeGreaterThan(0);
        expect(callArgs.attributes?.method).toBe('GET');
        expect(callArgs.attributes?.endpoint).toBe(testUrl);

        done();
      }
    });

    const req = httpMock.expectOne(testUrl);

    // Simulate some delay
    setTimeout(() => {
      req.flush({ data: 'test' });
    }, 50);
  });

  it('should not break the request flow', (done) => {
    const testUrl = '/api/auctions';
    const testData = { auctions: ['item1', 'item2'] };

    httpClient.get(testUrl).subscribe({
      next: (data) => {
        // Verify data is passed through correctly
        expect(data).toEqual(testData);
        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.flush(testData);
  });

  it('should handle Grafana service errors gracefully', (done) => {
    // Make Grafana service throw errors
    grafanaService.trackEvent.and.throwError('Grafana error');
    grafanaService.trackPerformance.and.throwError('Grafana error');

    const testUrl = '/api/auctions';

    httpClient.get(testUrl).subscribe({
      next: (data) => {
        // Request should still succeed even if Grafana tracking fails
        expect(data).toEqual({ success: true });
        done();
      }
    });

    const req = httpMock.expectOne(testUrl);
    req.flush({ success: true });
  });

  it('should track multiple requests independently', (done) => {
    const url1 = '/api/auctions';
    const url2 = '/api/bids';

    let completedRequests = 0;

    httpClient.get(url1).subscribe(() => {
      completedRequests++;
      if (completedRequests === 2) {
        expect(grafanaService.trackEvent).toHaveBeenCalledTimes(2);
        expect(grafanaService.trackPerformance).toHaveBeenCalledTimes(2);
        done();
      }
    });

    httpClient.get(url2).subscribe(() => {
      completedRequests++;
      if (completedRequests === 2) {
        expect(grafanaService.trackEvent).toHaveBeenCalledTimes(2);
        expect(grafanaService.trackPerformance).toHaveBeenCalledTimes(2);
        done();
      }
    });

    const req1 = httpMock.expectOne(url1);
    const req2 = httpMock.expectOne(url2);

    req1.flush({ data: 'test1' });
    req2.flush({ data: 'test2' });
  });
});

