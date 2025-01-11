import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../models/User.model';
import { Model } from 'mongoose';
import { MongoModels } from 'src/models/models.enum';
import { wheelNumbers } from '../../../../constants/wheel.constants';
import { BetDataItem } from '../../../../types/bets';

@Injectable()
export class BetsService {
  constructor(
    @InjectModel(MongoModels.User) private readonly userModel: Model<User>,
  ) {}

  async onBetPlaced(data: { userId: string; bets: BetDataItem[] }) {
    const { userId, bets } = data;
    console.log('userId', userId);
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new Error('User not found');
    }

    const winningNumber =
      wheelNumbers[Math.floor(Math.random() * wheelNumbers.length)];

    let totalWinnings = 0;
    let totalBetAmount = 0;

    bets.forEach((bet) => {
      const betAmount = Number(bet.amount);
      if (isNaN(betAmount)) {
        return;
      }

      totalBetAmount += betAmount;
      if (bet.payload.includes(winningNumber.toString())) {
        totalWinnings += bet.amount * bet.payoutScale;
      }
    });

    if (user.balance < totalBetAmount) {
      throw new Error('Insufficient funds');
    }

    user.balance += totalWinnings - totalBetAmount;
    await user.save();

    return { winningNumber, totalWinnings, newBalance: user.balance };
  }
}
