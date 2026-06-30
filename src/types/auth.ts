export interface User {
  id: string;
  email: string;
  name: string;
  jobRole: string;
  experienceLevel: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
