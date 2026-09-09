export interface UserDto {
  id: string;
  name: string;
  email: string;
  rowStatus: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterUserDto {
  email: string;
  password: string;
  name: string;
}

export interface RegisterUserResponseDto {
  user: UserDto;
  token: string;
}
