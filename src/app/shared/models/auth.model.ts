export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userName: string;
}

export interface RegisterForm {
  code: string;
  description: string;
  location: string;
  responsible: string;
  phone: string;
}

export interface JwtToken {
  sub: string;
  jti: string;
  email: string;
  UserID: string;
  RoleName: string;
  exp: number;
  iss: string;
  aud: string;
}
