import type { FastifyReply, FastifyRequest } from 'fastify';
import type { GetTransactionsQuery } from '../../schemas/transaction.schema';
import { TransactionFilter } from '../../types/transaction.types';
import prisma from '../../config/prisma';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';


dayjs.extend(utc);



export const getTransactions = async (
    request: FastifyRequest<{ Querystring: GetTransactionsQuery }>,
    reply: FastifyReply
): Promise<void> => {

    const userId = "dçfkmgwsefm"

    if (!userId) {
        reply.status(401).send({ message: 'Usuario nao autenticado' });
        return;
    }

    const { month, year, type, categoryId } = request.query

    const filters: TransactionFilter = { userId };

    if (month && year) {

        const starDate = dayjs.utc(`${year}-${month}-01`).startOf('month').toDate();
        const endDate = dayjs.utc(starDate).endOf('month').toDate();
        filters.date = { gte: starDate, lte: endDate };
    }

    if (type) {
        filters.type = type;
    }

    if (categoryId) {
        filters.categoryId = categoryId;
    }

    try {
        const transactions = await prisma.transaction.findMany({
            where: filters,
            orderBy: { date: 'desc' },
            include: {
                category: {
                    select: {
                        color: true,
                        name: true,
                        type: true
                    },
                },
            },
        });

        reply.send({ transactions });
    }

    catch (error) {
        request.log.error(error, 'erro ao trazer transações');
        reply.status(500).send({ message: 'Erro do Servidor' });
    }

};



