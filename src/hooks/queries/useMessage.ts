import { useQuery } from '@tanstack/react-query';
import { getInbox } from '../../services/message.service';

export const useGetInbox = (receiverId: number | undefined) => {
    return useQuery({
        queryKey: ['inbox', receiverId],
        queryFn: () => getInbox(receiverId!),
        enabled: !!receiverId,
    });
};