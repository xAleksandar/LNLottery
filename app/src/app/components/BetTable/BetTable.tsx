"use client";
import { useState } from "react";
import {
  RouletteTable,
  useRoulette,
  RouletteWheel,
  ChipList,
  AvailableNumbers,
} from "react-casino-roulette";

import { chipImages } from "./assets/chips";

import "react-casino-roulette/dist/index.css";

const chips = {
  "1": chipImages.oneDollarChip,
  "10": chipImages.tenDollarChip,
  "100": chipImages.hundredDollarChip,
  "500": chipImages.fiveHundredDollarChip,
};

const numbers = [
  "00",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
];

function BetTable() {
  const [winningBet, setWinningBet] = useState<"-1" | AvailableNumbers>("-1");
  const [wheelStart, setWheelStart] = useState(false);
  const [balance, setBalance] = useState(1000); // Start with a balance
  const [selectedChip, setSelectedChip] = useState(Object.keys(chips)[0]);
  const { bets, onBet, clearBets } = useRoulette();

  const doSpin = () => {
    console.warn("bets", bets);
    if (Object.keys(bets).length === 0) {
      alert("Place your bets before spinning!");
      return;
    }

    // Generate a random winning number and cast it as AvailableNumbers
    const randomNumber = numbers[
      Math.floor(Math.random() * numbers.length)
    ] as AvailableNumbers;
    setWinningBet(randomNumber); // This is now valid
    setWheelStart(true);
  };

  const handleEndSpin = (winner: string) => {
    alert(`The ball landed on ${winner}!`);
    calculateWinnings(winner);
    setWheelStart(false);
    clearBets(); // Reset bets for the next round
  };

  const calculateWinnings = (winner: string) => {
    let totalWinnings = 0;
    console.log("winner", winner);
    Object.entries(bets).forEach(([betType, betDetails]) => {
      const betAmount = Number(betDetails.amount); // Accessing amount from nested structure
      console.log("betType", betType);
      // Ensure betAmount is valid
      if (isNaN(betAmount)) {
        console.warn(`Invalid bet amount for ${betType}: ${betDetails.amount}`);
        return; // Skip invalid amounts
      }

      // Check if it's a straight-up number bet
      if (betType === "number" && betDetails.payload.includes(winner)) {
        totalWinnings += betAmount * 36; // Number bet pays 35:1
      }

      // Check if it's a red or black bet
      if (betType === "RED" && isRed(winner)) {
        console.warn("Red is winn");
        totalWinnings += betAmount * betDetails.payoutScale; // Red bet pays 2:1
      } else if (betType === "BLACK" && isBlack(winner)) {
        totalWinnings += betAmount * betDetails.payoutScale; // Black bet pays 2:1
      }
    });

    // Calculate total losses
    const totalLosses = Object.values(bets).reduce(
      (sum, betDetails) => sum + Number(betDetails.amount), // Sum of all bet amounts
      0
    );

    console.warn("totalWinnings", totalWinnings);
    console.warn("totalLosses", totalLosses);
    console.warn("Prev", balance);

    setBalance((prev) => prev - totalLosses + totalWinnings);
  };

  const isRed = (number: string) => {
    const redNumbers = [
      "1",
      "3",
      "5",
      "7",
      "9",
      "12",
      "14",
      "16",
      "18",
      "19",
      "21",
      "23",
      "25",
      "27",
      "30",
      "32",
      "34",
      "36",
    ];
    return redNumbers.includes(number);
  };

  const isBlack = (number: string) => {
    const blackNumbers = [
      "2",
      "4",
      "6",
      "8",
      "10",
      "11",
      "13",
      "15",
      "17",
      "20",
      "22",
      "24",
      "26",
      "28",
      "29",
      "31",
      "33",
      "35",
    ];
    return blackNumbers.includes(number);
  };

  return (
    <div>
      <h1>Roulette Game</h1>
      <h2>Balance: ${balance}</h2>

      <RouletteWheel
        start={wheelStart}
        winningBet={winningBet}
        onSpinningEnd={handleEndSpin}
      />

      <RouletteTable
        chips={chips}
        bets={bets}
        onBet={onBet(parseInt(selectedChip))}
      />

      <ChipList
        chips={chips}
        selectedChip={selectedChip}
        onChipPressed={(chip) => setSelectedChip(chip)}
      />

      <button onClick={doSpin} disabled={wheelStart || balance <= 0}>
        Spin
      </button>
      <button
        onClick={clearBets}
        disabled={wheelStart || Object.keys(bets).length === 0}
      >
        Clear Bets
      </button>
    </div>
  );
}

export default BetTable;
