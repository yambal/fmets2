export interface Letter {
  id: string;
  user_id: string;
  nickname: string;
  body: string;
  processed: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  nickname: string;
  updated_at: string;
}
