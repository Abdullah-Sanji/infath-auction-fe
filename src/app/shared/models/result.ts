export interface Result<T = unknown> {
  errorMessage: string;
  errorCode: string;
  isSuccess: boolean;
  statusCode: number;
  data: T;
  errorDetails: Record<string, string[]>;
}

export interface PaginatedResult<T = unknown> {
  errorMessage: string;
  errorCode: string;
  isSuccess: boolean;
  statusCode: number;
  data: PaginatedData<T>;
  errorDetails: Record<string, string[]>;
}

export interface PaginatedData<T = unknown> {
  items: T[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}
