import { getCustomRepository } from 'typeorm';
import { Router } from 'express';

import multer from 'multer';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

import multerConfig from '../config/upload';

const transactionsRouter = Router();

const upload = multer(multerConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionRepository.find();

  const balance = await transactionRepository.getBalance();

  return response.json({
    transactions,
    balance,
  });
});

/**
 * Na rota iremos sempre captura os dados da requisição
 */
transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  const createTransactionService = new CreateTransactionService();

  const transcations = await createTransactionService.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transcations);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const deleteTransactionService = new DeleteTransactionService();

  await deleteTransactionService.execute({
    id,
  });

  return response.json();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    // const importTransactionsService = new ImportTransactionsService();

    // const transactions = await importTransactionsService.execute();

    return response.json();
  },
);

export default transactionsRouter;
