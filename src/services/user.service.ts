import type { UserSearchResponse } from '../types/user.type';
import { api } from './api';

export const findUserByUsername = async (username: string) => {
    const response = await api.get<UserSearchResponse>(`/users/search?username=${username}`);
    return response.data;
};