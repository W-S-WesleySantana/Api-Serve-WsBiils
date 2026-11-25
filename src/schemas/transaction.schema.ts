import { getTransactions } from './../controllers/transactions/getTransactions.controller';

import { z } from "zod";
import { ObjectId } from 'mongodb'
import { TransactionType } from "@prisma/client";

const isValidObjetId = (id: string): boolean => ObjectId.isValid(id);

export const createTransactionSchema = z.object({
    description: z.string().min(1, { message: 'A descrição deve ter no mínimo 1 caracteres' }),
    amout: z.number().positive("O valor da transação deve ser positivo"),
    date: z.coerce.date({
        error: () => ({ message: 'Data inválida' }),
    }),
    categoryId: z.string().refine(isValidObjetId, { message: 'ID de categoria inválido' }),
    type: z.enum([TransactionType.expense, TransactionType.income], { message: 'Tipo de transação inválido' }),

});

export const getTransactionsSchema = z.object({
    month: z.string().optional(),
    year: z.string().optional(),
    type: z.enum([TransactionType.expense, TransactionType.income], { message: 'Tipo de transação inválido' }).optional(),
    categoryId: z.string().refine(isValidObjetId, { message: 'ID de categoria inválido' }).optional(),
});

export const getTransactionsSumarySchema = z.object({
    month: z.string({message: 'Mês é obrigatório'}),
    year: z.string({message: 'O Ano é obrigatório'}),
   
})

export const deleteTransactionSchema = z.object({
   id: z.string().refine(isValidObjetId, { message: 'ID de transação inválido'})
   
})




export type GetTransactionsQuery = z.infer<typeof getTransactionsSchema>;
export type GetTransactionsSumaryQuery = z.infer<typeof getTransactionsSumarySchema>;
export type deleteTransactionParams = z.infer<typeof deleteTransactionSchema>;