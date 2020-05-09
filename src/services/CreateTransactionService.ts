import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

/**
 * Iremos importa nosso repository JÁ iremos usar o banco de dados
 * O repository é nossa interface com nosso banco de dedos
 * Por ser uma entidade de Repository iremos ter
 */
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transicationRepository = getCustomRepository(TransactionsRepository);

    const { total } = await transicationRepository.getBalance();

    if (value > total && type === 'outcome') {
      throw new AppError('Saldo insuficiênte', 400);
    }

    // Iremos criar nosso repositorio a parti do nosso model
    const categoryRepository = getRepository(Category);

    /**
     * Validação se a categoria já existe
     */

    let transactionCategory = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    /**
     * Validação se a categoria não existe
     */
    if (!transactionCategory) {
      transactionCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(transactionCategory);
    }

    const transications = transicationRepository.create({
      title,
      value,
      type,
      category: transactionCategory,
    });

    await transicationRepository.save(transications);

    return transications;
  }
}

export default CreateTransactionService;
