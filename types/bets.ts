export interface BetDataItem {
  amount: number;
  payload: string[];
  payoutScale: number;
}

export type Bet = Record<string, BetDataItem>;
