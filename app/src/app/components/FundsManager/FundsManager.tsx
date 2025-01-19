"use client";
import { useState, useEffect } from "react";
import classNames from "classnames";
import { useQRCode } from "next-qrcode";
import { ApiService } from "../../lib/api/api";
import { InputField } from "../";
import { onPaymentReceived } from "@/app/lib/webSockets/webSockets";
import CircularProgress from "@mui/material/CircularProgress";
import AnimatedCheckmark from "./AnimatedCheckmark";

import styles from "./FundsManager.module.scss";

type Props = {
  balance: number;
};

const FundsManager = (props: Props) => {
  const { balance } = props;
  const apiService = new ApiService();
  const [invoice, setInvoice] = useState("");
  const [previousBalance, setPreviousBalance] = useState(0);
  const [showBalance, setShowBalance] = useState("");
  const [selectedOption, setSelectedOption] = useState(0);
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState("");
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);

  const { Canvas } = useQRCode();

  useEffect(() => {
    if (balance !== previousBalance && previousBalance !== 0) {
      setShowBalance(
        balance > previousBalance
          ? `+${balance - previousBalance} sats`
          : `-${previousBalance - balance} sats`
      );
      setTimeout(() => {
        setShowBalance("");
      }, 2000);
    }
    setPreviousBalance(balance);
  }, [balance]);

  const onDepositSelected = () => {
    setSelectedOption(1);
  };

  const onWithdrawSelected = () => {
    setSelectedOption(2);
  };

  const onPaymentConfirmed = () => {
    setIsPaymentConfirmed(true);
    setAmount(0);
    setTimeout(() => {
      setSelectedOption(0);
      setInvoice("");
      setIsPaymentConfirmed(false);
    }, 2000);
  };

  const handleDeposit = async () => {
    const response = await apiService.createDepositInvoice(amount);
    console.warn(response);
    setInvoice(response.payment_request);
    onPaymentReceived(response.payment_hash, onPaymentConfirmed);
  };

  const handleWithdrawal = async () => {
    const response = await apiService.createWithdrawalInvoice(amount, false);
    console.warn(response);
    setInvoice(response.lnurl);
    onPaymentReceived(response.payment_hash, onPaymentConfirmed);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  const onClose = () => {
    setSelectedOption(0);
    setAmount(0);
    setError("");
    setInvoice("");
  };

  return (
    <div className={styles.wrapper}>
      <button className={styles.button} onClick={onDepositSelected}>
        Deposit
      </button>
      <p className={styles.balanceWrapper}>
        Balance:&nbsp;
        <span
          className={classNames(styles.balance, {
            [styles.positiveChange]: showBalance && showBalance.startsWith("+"),
            [styles.negativeChange]: showBalance && showBalance.startsWith("-"),
          })}
        >
          {balance}
          &nbsp;{showBalance}
        </span>
      </p>
      <button className={styles.button} onClick={onWithdrawSelected}>
        Withdraw
      </button>
      {selectedOption !== 0 && (
        <div className={styles.wrapperModal}>
          <div className={styles.content}>
            {invoice.length === 0 ? (
              <>
                <InputField
                  fullWidth
                  label="Enter amount"
                  value={amount.toString()}
                  onChange={handleAmountChange}
                  error={error}
                />
                <button
                  className={styles.submit}
                  onClick={
                    selectedOption === 1 ? handleDeposit : handleWithdrawal
                  }
                >
                  {selectedOption === 1 ? "Deposit" : "Withdraw"}
                </button>
              </>
            ) : (
              <>
                <div className={styles.qrCode}>
                  <Canvas
                    text={invoice}
                    options={{
                      width: 224,
                    }}
                  />
                </div>
                <div className={styles.paymentText}>
                  {isPaymentConfirmed ? (
                    <div className={styles.paymentSuccess}>
                      {selectedOption === 1
                        ? "Payment Confirmed."
                        : "Payment Sent."}
                      <AnimatedCheckmark />
                    </div>
                  ) : (
                    <div className={styles.paymentPending}>
                      {selectedOption === 1
                        ? "Awaiting confirmation.."
                        : "Scan QR code to withdraw.."}
                      <CircularProgress
                        size={22}
                        style={{ color: "white", marginLeft: "8px" }}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
            <button className={styles.submit} onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundsManager;
