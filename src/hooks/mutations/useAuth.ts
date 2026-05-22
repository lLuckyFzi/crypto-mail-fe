import { useMutation } from '@tanstack/react-query';
import { api } from '../../services/api';
import type { AuthPayload, AuthResponse } from '../../types';

export const useRegister = () => {
  return useMutation<AuthResponse, Error, AuthPayload>({
    mutationFn: async (payload) => {
      const response = await api.post<AuthResponse>('/users/register', payload);
      return response.data;
    },
  });
};

export const useLogin = () => {
  return useMutation<AuthResponse, Error, AuthPayload>({
    mutationFn: async (payload) => {
      const response = await api.post<AuthResponse>('/users/login', payload);
      return response.data;
    },
  });
};