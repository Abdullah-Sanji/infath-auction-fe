export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  phoneCountryCode: string;
  avatarUrl?: string;
  bidsCount: number;
  favoritesCount: number;
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface ProfileMenuItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  route?: string;
  active?: boolean;
}

export interface ProfileMenuSection {
  title: string;
  items: ProfileMenuItem[];
}

export interface ProfileUpdateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface ProfileUpdateResponse {
  success: boolean;
  message?: string;
  data?: UserProfile;
}

