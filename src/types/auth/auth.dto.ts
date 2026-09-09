export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthUserDto {
  id: string;
  name: string;
  email: string;
  rowStatus: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponseDto {
  user: AuthUserDto;
  token: string;
}