"use client";
import { useState, useEffect } from "react";
import classNames from "classnames";
import {
  RouletteTable,
  useRoulette,
  RouletteWheel,
  ChipList,
  AvailableNumbers,
} from "react-casino-roulette";

import { onBetPlaced, onBetResolved } from "@/app/lib/webSockets/webSockets";
import { chips } from "./assets/chips";

import "react-casino-roulette/dist/index.css";

import styles from "./BetTable.module.scss";

type Props = {
  balance: number;
  updateBalance: () => void;
};

const BetTable = (props: Props) => {
  const { balance, updateBalance } = props;

  const [wheelStart, setWheelStart] = useState(false);
  const [winningBet, setWinningBet] = useState<"-1" | AvailableNumbers>("-1");
  const [selectedChip, setSelectedChip] = useState(Object.keys(chips)[0]);
  const { bets, onBet, clearBets } = useRoulette();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const doSpin = () => {
    if (Object.keys(bets).length === 0) {
      alert("Place your bets before spinning!");
      return;
    }

    const betsArray = Object.values(bets);

    let amount = 0;
    betsArray.forEach((bet) => {
      amount += bet.amount;
    });

    if (amount > balance) {
      alert("You don't have enough balance to place these bets!");
      return;
    }

    onBetPlaced(betsArray);
    onBetResolved((number) => {
      setWinningBet(number);
      setWheelStart(true);
    });
  };

  const handleEndSpin = () => {
    updateBalance();
    setWheelStart(false);
    clearBets();
    // alert(`The ball landed on ${winner}!`);
  };

  return isClient ? (
    <div
      className={classNames(styles.wrapper, {
        [styles.wrapperSmallScreen]: true,
      })}
    >
      <div className={styles.firstSection}>
        <RouletteWheel
          start={wheelStart}
          winningBet={winningBet}
          onSpinningEnd={handleEndSpin}
          layoutType="european"
        />
        <div className={styles.buttonsWrapper}>
          <button className={styles.spinButton} onClick={doSpin}>
            Spin
          </button>
          <button
            className={styles.clearButton}
            disabled={Object.keys(bets).length === 0}
            onClick={clearBets}
          >
            Clear Bets
          </button>
        </div>
      </div>
      <div className={styles.secondSection}>
        <div className={styles.table}>
          <RouletteTable
            chips={chips}
            bets={bets}
            onBet={onBet(parseInt(selectedChip))}
          />
        </div>
        <ChipList
          chips={chips}
          selectedChip={selectedChip}
          onChipPressed={(chip) => setSelectedChip(chip)}
        />
      </div>
    </div>
  ) : null;
};

export default BetTable;
