export interface DepositRequest {
  amount: number;
}

export interface WithdrawalRequest {
  amount: number;
  isManual?: boolean;
}
