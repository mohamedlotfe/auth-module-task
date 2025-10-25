export interface CreateUserDto {
  email: string;
  name: string;
  passwordHash: string;
  roles?: string[];
}
