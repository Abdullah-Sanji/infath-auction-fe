import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProfileService } from './profile.service';
import { UserProfile, ProfileUpdateRequest, ProfileUpdateResponse } from '../interfaces/profile.interface';

describe('ProfileService', () => {
  let service: ProfileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProfileService]
    });

    service = TestBed.inject(ProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user profile', () => {
    const mockProfile: UserProfile = {
      id: '1',
      firstName: 'خالد',
      lastName: 'أحمد',
      email: 'khaled@gmail.com',
      phoneNumber: '0000000000',
      phoneCountryCode: '+962',
      bidsCount: 65,
      favoritesCount: 10
    };

    service.getUserProfile().subscribe(profile => {
      expect(profile).toEqual(mockProfile);
      expect(profile.firstName).toBe('خالد');
    });

    const req = httpMock.expectOne('/api/profile');
    expect(req.request.method).toBe('GET');
    req.flush(mockProfile);
  });

  it('should update profile', () => {
    const updateData: ProfileUpdateRequest = {
      firstName: 'محمد',
      lastName: 'علي',
      email: 'mohammed@gmail.com',
      phoneNumber: '1234567890'
    };

    const mockResponse: ProfileUpdateResponse = {
      success: true,
      message: 'Profile updated successfully'
    };

    service.updateProfile(updateData).subscribe(response => {
      expect(response.success).toBe(true);
      expect(response.message).toBe('Profile updated successfully');
    });

    const req = httpMock.expectOne('/api/profile');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateData);
    req.flush(mockResponse);
  });

  it('should upload avatar', () => {
    const mockFile = new File([''], 'avatar.png', { type: 'image/png' });
    const mockResponse = { avatarUrl: 'https://example.com/avatar.png' };

    service.uploadAvatar(mockFile).subscribe(response => {
      expect(response.avatarUrl).toBe('https://example.com/avatar.png');
    });

    const req = httpMock.expectOne('/api/profile/avatar');
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBe(true);
    req.flush(mockResponse);
  });

  it('should delete avatar', () => {
    const mockResponse = { success: true };

    service.deleteAvatar().subscribe(response => {
      expect(response.success).toBe(true);
    });

    const req = httpMock.expectOne('/api/profile/avatar');
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('should handle error when fetching profile', () => {
    service.getUserProfile().subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne('/api/profile');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  it('should handle error when updating profile', () => {
    const updateData: ProfileUpdateRequest = {
      firstName: 'محمد',
      lastName: 'علي',
      email: 'invalid-email',
      phoneNumber: '123'
    };

    service.updateProfile(updateData).subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error.status).toBe(400);
      }
    });

    const req = httpMock.expectOne('/api/profile');
    req.flush('Validation Error', { status: 400, statusText: 'Bad Request' });
  });
});

