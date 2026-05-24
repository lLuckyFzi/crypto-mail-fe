export interface BaseResponse {
    status: string;
    message?: string;
}

export interface UserData {
  user_id: number;
  username: string;
  public_key_e: string;
  public_key_n: string;
  private_key?: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: UserData;
}

export interface AuthPayload {
  username: string;
}