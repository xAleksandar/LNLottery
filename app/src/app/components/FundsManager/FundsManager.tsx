"use client";
import { useState } from "react";
import styles from "./FundsManager.module.css";
import { useQRCode } from "next-qrcode";
import { ApiService } from "../../lib/api/api";
import { onPaymentReceived } from "@/app/lib/webSockets/webSockets";
import useUserStore from "../../lib/store/user.store";
import CircularProgress from "@mui/material/CircularProgress";
import AnimatedCheckmark from "./AnimatedCheckmark";

const FundsManager = () => {
  const apiService = new ApiService();
  const [invoice, setInvoice] = useState("");
  const [selectedOption, setSelectedOption] = useState(0);
  const [amount, setAmount] = useState(0);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);

  const { Canvas } = useQRCode();
  const { balance } = useUserStore();

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

  return (
    <div className={styles.wrapper}>
      <h1>Funds Manager</h1>
      <p>Manage your funds here {balance}</p>
      <button onClick={onDepositSelected}>Deposit</button>
      <button onClick={onWithdrawSelected}>Withdraw</button>
      {selectedOption !== 0 && (
        <div className={styles.wrapperModal}>
          <div className={styles.content}>
            {invoice.length === 0 ? (
              <>
                <input
                  onChange={handleAmountChange}
                  type="text"
                  placeholder="Enter amount"
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
            <button
              className={styles.submit}
              onClick={() => setSelectedOption(0)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundsManager;
