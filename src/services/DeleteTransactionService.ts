import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionRepository);

    const transactionExists = await transactionsRepository.findOne(id);

    if (!transactionExists) {
      throw new AppError('Transaction does not exist');
    }

    await transactionsRepository.remove(transactionExists);
  }
}

export default DeleteTransactionService;
