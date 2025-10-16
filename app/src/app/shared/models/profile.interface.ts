export interface Card {
  userId: string;
  uuid: string;
  balance: number;
  status: 'PENDING' | 'ACTIVATED' | 'BLOCKED';
  createdAt: string;
  type: 'CREDIT' | 'DEBIT';
}

export interface ProfileData {
  email: string;
  name: string;
  document: string;
  lastName: string;
  cards: Card[];
}

export interface ProfileResponse {
  message: string;
  data: ProfileData;
}
