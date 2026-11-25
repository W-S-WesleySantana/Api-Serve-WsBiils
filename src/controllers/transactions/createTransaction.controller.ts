
import type { FastifyReply, FastifyRequest } from 'fastify';
import { createTransactionSchema } from '../../schemas/transaction.schema';
import prisma from '../../config/prisma';



const createTansaction = async (request: FastifyRequest, Reply: FastifyReply): Promise<void> => {

    const userId = 'dsfsgvesrfbed' // pegar o id do usuario logado

    if (!userId) {
        return Reply.status(401).send({ error: 'Usuario nao Autenticado' });


    }

    //validação dos dados

    const result = createTransactionSchema.safeParse(request.body);

    if (result.success === false) {
        const errorMensagem = result.error.issues[0].message || 'Erro de validação';
        return Reply.status(400).send({ error: result.error.issues[0].message });
    }

    const transaction = result.data;


    try {
        const category = await prisma.category.findFirst({
            where: {
                id: transaction.categoryId,
                type: transaction.type,
            }

        });

        if (!category) {
            Reply.status(404).send({ error: 'Categoria não encontrada' });
            return
        }

        const parseData = new Date(transaction.date);

        const newTransaction = await prisma.transaction.create({
            data: {
                ...transaction,
                amount: transaction.amout,
                userId: userId,
                date: parseData,
            },
            include: {
                category: true

            }
        });
        Reply.status(201).send(newTransaction);

    } catch (error) {

        request.log.error(error, 'Erro ao criar transação');
        Reply.status(500).send({ error: 'Erro Interno do servidor' });
    }
};


export default createTansaction