export interface MessageData {
    id: number;
    pengirim_id: number;
    penerima_id: number;
    sender_name: string;
    ciphertext: string;
    dibuat_pada: string;
}

export interface GetMessagesResponse {
    status: string;
    data: MessageData[];
}

export interface SendMessagePayload {
    sender_id: number;
    receiver_id: number;
    ciphertext: string;
}