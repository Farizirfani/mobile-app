import api from './api';

export interface UserWithToken {
  _id: string;
  name: string;
  email: string;
  role: string;
  grade: string;
  token: string;
  avatar?: string;
}

export const loginUser = async (email: string, password: string): Promise<UserWithToken> => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  grade: string = '12',
  role: string = 'student'
): Promise<UserWithToken> => {
  const response = await api.post('/api/auth/register', { name, email, password, grade, role });
  return response.data;
};
