import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transicationRepository = getCustomRepository(TransactionsRepository);

    const transicationExists = await transicationRepository.find({ id });

    if (transicationExists.length === 0) {
      throw new AppError('Transação não existente', 400);
    }

    await transicationRepository.delete({ id });
  }
}

export default DeleteTransactionService;
