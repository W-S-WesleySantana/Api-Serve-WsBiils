import type { FastifyInstance } from "fastify"
import categoryRoutes from "./category.routes"
import transactionRoutes from "./transactin.routes"

async function routes(fastify: FastifyInstance): Promise<void> {

    fastify.get('/health', async (request, reply) => {

        return {
            status: 'ok',
            mensage: 'WsBills API Rodando normalmente'

        }

    }
    )

    fastify.register(categoryRoutes, { prefix: '/categories' });

    fastify.register(transactionRoutes, { prefix: '/transaction' });
}

export default routes