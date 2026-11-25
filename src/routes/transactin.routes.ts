import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import createTransaction from '../controllers/transactions/createTransaction.controller';
import { getTransactions } from '../controllers/transactions/getTransactions.controller';
import { getTransactionsSumary } from '../controllers/transactions/getTransactionsSumary.controller';
import {
  createTransactionSchema,
  deleteTransactionSchema,
  getTransactionsSchema,
  getTransactionsSumarySchema
} from '../schemas/transaction.schema';
import { deleteTransaction } from '../controllers/transactions/delete.transaction.controller';

const jsonSchemaOptions = {
  target: 'draft-7',
  unrepresentable: 'any',
} as const;

const transactionRoutes = async (fastify: FastifyInstance) => {
  // CRIAÇÃO
  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      body: z.toJSONSchema(createTransactionSchema, jsonSchemaOptions),
    },
    handler: createTransaction,
  });

  // BUSCA COM FILTRO
  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      querystring: z.toJSONSchema(getTransactionsSchema, jsonSchemaOptions),
    },
    handler: getTransactions,
  });

  // Busca o resumo
  fastify.route({
    method: 'GET',
    url: '/sumary',
    schema: {
      querystring: z.toJSONSchema(getTransactionsSumarySchema, jsonSchemaOptions),
    },
    handler: getTransactionsSumary,
  });

  // DELETAR TRANSAÇÃO
  fastify.route({
    method: 'DELETE',
    url: '/:id',
    schema: {
      params: z.toJSONSchema(deleteTransactionSchema, jsonSchemaOptions),
    },
    handler: deleteTransaction,
  });
};

export default transactionRoutes;
