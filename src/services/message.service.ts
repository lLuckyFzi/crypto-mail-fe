import type { BaseResponse } from '../types';
import type { GetMessagesResponse, SendMessagePayload } from '../types/message.type';
import { api } from './api';

export const getInbox = async (receiverId: number) => {
    const response = await api.get<GetMessagesResponse>(`/pesan?receiver_id=${receiverId}`);
    return response.data;
};

export const sendMessage = async (payload: SendMessagePayload) => {
    const response = await api.post<BaseResponse>('/pesan/kirim', payload);
    return response.data;
};