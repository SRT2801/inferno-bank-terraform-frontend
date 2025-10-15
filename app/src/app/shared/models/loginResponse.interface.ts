export interface LoginResponse {
  message: string;
  data: {
    token: string;
    user: {
      name: string;
      lastName?: string;
      email?: string;
      id?: string;
    };
  };
}
