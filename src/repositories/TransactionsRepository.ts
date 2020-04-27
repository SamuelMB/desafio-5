import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const income = await this.getIncome();
    const outcome = await this.getOutcome();
    return {
      income,
      outcome,
      total: income - outcome,
    };
  }

  private async getIncome(): Promise<number> {
    const incomeTransactions = await this.find({ type: 'income' });
    return this.reduceTransactions(incomeTransactions);
  }

  private async getOutcome(): Promise<number> {
    const outcomeTransactions = await this.find({ type: 'outcome' });
    return this.reduceTransactions(outcomeTransactions);
  }

  private reduceTransactions(transactions: Transaction[]): number {
    return transactions.reduce(
      (accumulator, transaction) => accumulator + Number(transaction.value),
      0,
    );
  }
}

export default TransactionsRepository;
