import { useMutation } from '@tanstack/react-query';
import type { BaseResponse } from '../../types';
import type { SendMessagePayload } from '../../types/message.type';
import { sendMessage } from '../../services/message.service';

export const useSendMessage = () => {
    return useMutation<BaseResponse, Error, SendMessagePayload>({
        mutationFn: (payload) => sendMessage(payload),
    });
};