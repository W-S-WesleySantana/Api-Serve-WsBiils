import { initiallizeGlobalCategorie } from './services/globalCategories.services';
import app from "./app";
import { prismaConnect } from "./config/prisma";
import { env } from './config/env';

const PORT = env.PORT;

const startServer = async () => {
    try {


        await prismaConnect();

        await initiallizeGlobalCategorie();


        await app.listen({ port: PORT }).then(() => {
            console.log(`Servidor Rodando na Porta ${PORT}`)
        })

    } catch (err) {
        console.error(err);

    }
}

startServer();