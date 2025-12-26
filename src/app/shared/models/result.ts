export interface Result<T = unknown> {
  errorMessage: string;
  errorCode: string;
  isSuccess: boolean;
  statusCode: number;
  data: T;
  errorDetails: Record<string, string[]>;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}
