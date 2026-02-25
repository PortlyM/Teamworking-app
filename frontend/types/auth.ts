// types/auth.ts
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface DjangoTokenResponse {
  accessToken: string;
  refreshToken: string;
}