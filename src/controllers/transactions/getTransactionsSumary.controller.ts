
import type { FastifyReply, FastifyRequest } from "fastify";
import type { GetTransactionsSumaryQuery } from "../../schemas/transaction.schema";
import type { CategorySumary } from "../../types/category.types";
import type { transacrionsSumary } from "../../types/transaction.types";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import prisma from "../../config/prisma";
import { TransactionType } from "@prisma/client";

dayjs.extend(utc);




export const getTransactionsSumary = async (
    request: FastifyRequest<{ Querystring: GetTransactionsSumaryQuery }>,
    reply: FastifyReply,
): Promise<void> => {

    const userId = 'dsfsgvesrfbed' // pegar o id do usuario logado

    if (!userId) {
        return reply.status(401).send({ error: 'Usuario nao Autenticado' });

    }

    const { month, year } = request.query;

    if (!month || !year) {
        return reply.status(400).send({ error: 'Mes e ano são obrigatorios' });
    }


    const starDate = dayjs.utc(`${year}-${month}-01`).startOf('month').toDate();
    const endDate = dayjs.utc(starDate).endOf('month').toDate();

    try {
        const transactions = await prisma.transaction.findMany({
            where: {
                userId,
                date: {
                    gte: starDate,
                    lte: endDate,
                },
            },
            include: {
                category: true,
            },
        });

        let totalIncome = 0;
        let totalExpense = 0;
        const groupedExpenses = new Map<string, CategorySumary>();

        for (const transaction of transactions) {

            if (transaction.type === TransactionType.expense) {


                const existing = groupedExpenses.get(transaction.categoryId) ?? {
                    CategoryId: transaction.categoryId,
                    categoryName: transaction.category.name,
                    categoryColor: transaction.category.color,
                    amount: 0,
                    percentage: 0,
                }

                existing.amount += transaction.amount;

                groupedExpenses.set(transaction.categoryId, existing);

                totalExpense += transaction.amount;

            } else {
                totalIncome += transaction.amount
            }
        }

        const sumary: transacrionsSumary = {
            totalIncome,
            totalExpense,
            balance: Number((totalIncome - totalExpense).toFixed(2)),
            expenseByCategory: Array.from(groupedExpenses.values()).map((entry) => ({
                ...entry,
                percentage: Number.parseFloat(((entry.amount / totalExpense) * 100).toFixed(2)),
            })).sort((a, b) => b.amount - a.amount),
        }

        reply.send({ transactions });
    }

    catch (error) {
        request.log.error(error, 'erro ao trazer transações');
        reply.status(500).send({ message: 'Erro do Servidor' });
    }

}