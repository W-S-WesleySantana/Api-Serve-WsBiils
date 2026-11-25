import type { FastifyRequest, FastifyReply } from 'fastify';
import type { deleteTransactionParams } from '../../schemas/transaction.schema';
import prisma from '../../config/prisma';





export const deleteTransaction = async (
    request: FastifyRequest<{ Params: deleteTransactionParams }>,
    reply: FastifyReply,
): Promise<void> => {

    const userId = 'dsfsgvesrfbed' // pegar o id do usuario logado
    const { id } = request.params;

    if (!userId) {
        return reply.status(401).send({ error: 'Usuario nao Autenticado' });


    }

    try {

        const transaction = await prisma.transaction.findFirst({
            where: {
                id,
                userId,
            }
        });


        if (!transaction) {
            reply.status(404).send({ error: 'Transação não encontrada' });
            return
        }


        await prisma.transaction.delete({
            where:
                { id }
        });


        reply.status(200).send({ message: 'Transação deletada com sucesso' });

    }
    catch (error) {
        request.log.error({ error }, 'Erro ao deletar transação');
        reply.status(500).send({ error: 'Erro interno do servidor, falha ao deleta transação' });
    }

}
