export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  is_group: boolean;
  created_by: string;
  member_ids?: string[]; // Optional, fetched separately
}

export interface Message {
  id: string;
  content: string;
  room_id: string;
  user_id: string;
  username: string;
  created_at: string;
  updated_at?: string;
  type?: 'text' | 'system'; // <--- Add this line (optional)
}