import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Category from '../models/Category';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const categoriesRepository = getRepository(Category);

    const categoryExists = await categoriesRepository.findOne({
      where: { title: category },
    });

    const balance = await transactionsRepository.getBalance();
    if (type === 'outcome' && balance.total < value) {
      throw new AppError('Insufficient balance');
    }

    if (!categoryExists) {
      const newCategory = await categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(newCategory);

      const transaction = transactionsRepository.create({
        title,
        type,
        value,
        category_id: newCategory.id,
      });
      await transactionsRepository.save(transaction);
      return transaction;
    }

    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category_id: categoryExists?.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
