import type { UserData } from ".";

export interface UserSearchResponse {
    status: string;
    data: UserData;
}

export interface SendMessagePayload {
    receiver_id: number;
    ciphertext: string;
}