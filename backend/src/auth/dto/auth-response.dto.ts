export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    roles: string[];
  };
}

export interface AuthenticatedRequest {
  user: {
    userId: string;
    email: string;
    roles: string[];
  };
}
