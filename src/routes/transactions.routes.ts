import { Router } from 'express';

// import TransactionsRepository from '../repositories/TransactionsRepository';
// import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  return response.json();
});

transactionsRouter.post('/', async (request, response) => {
  return response.json();
});

transactionsRouter.delete('/:id', async (request, response) => {
  return response.json();
});

transactionsRouter.post('/import', async (request, response) => {
  return response.json();
});

export default transactionsRouter;
