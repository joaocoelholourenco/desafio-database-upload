import { EntityRepository, getRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsRepository = getRepository(Transaction);

    const transactions = await transactionsRepository.find();

    const { income, outcome } = transactions.reduce(
      (accumalator, transaction) => {
        switch (transaction.type) {
          case 'income':
            accumalator.income += Number(transaction.value);
            break;
          case 'outcome':
            accumalator.outcome += Number(transaction.value);
            break;
          default:
            break;
        }

        return accumalator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );
    const resTotal = income - outcome;

    return { income, outcome, total: resTotal };
  }
}
export default TransactionsRepository;
