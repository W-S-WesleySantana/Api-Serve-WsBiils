
import Fastify from 'fastify';
import routes from './routes';
import type { FastifyInstance }

    from 'fastify';
import { env } from 'node:process';

const app: FastifyInstance = Fastify({
    logger: {
        level: env.NODE_ENV === 'dev' ? 'info' : 'error',
    }
});

app.register(routes, { prefix: '/api' });

export default app 