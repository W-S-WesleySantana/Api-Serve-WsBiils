import  { TransactionType, Category } from "@prisma/client";
import { tr } from "framer-motion/client";
import prisma from "../config/prisma";

type GlobalCategoryInput = Pick<Category, 'name' | 'color' | 'type'>;


const globalCategories: GlobalCategoryInput[] = [

    //Despesas

    { name: 'Alimentação', color: '#FF5733', type: TransactionType.expense},
    { name: 'Transporte', color: '#33FF57', type: TransactionType.expense},
    { name: 'Saúde', color: '#3357FF', type: TransactionType.expense},
    { name: 'Educação', color: '#FF33A1', type: TransactionType.expense},
    { name: 'Lazer', color: '#A133FF', type: TransactionType.expense},
    { name: 'Moradia', color: '#33FFA1', type: TransactionType.expense},
    { name: 'Contas e Serviços', color: '#FFA133', type: TransactionType.expense},
    { name: 'Vestuário', color: '#33A1FF', type: TransactionType.expense},
    { name: 'Impostos e Taxas', color: '#A1FF33', type: TransactionType.expense},
    { name: 'Outros Gastos', color: '#FF33FF', type: TransactionType.expense},


    //Receitas

    { name: 'Salário', color: '#FF5733', type: TransactionType.income},
    { name: 'Investimentos', color: '#33FF57', type: TransactionType.income},
    { name: 'Presentes e Doações', color: '#3357FF', type: TransactionType.income},
    { name: 'Renda Extra', color: '#FF33A1', type: TransactionType.income},
    { name: 'Aluguel de Imóveis', color: '#A133FF', type: TransactionType.income},
    { name: 'Venda de Bens', color: '#33FFA1', type: TransactionType.income},
    { name: 'Juros e Dividendos', color: '#FFA133', type: TransactionType.income},
    { name: 'Reembolso de Despesas', color: '#33A1FF', type: TransactionType.income},
    { name: 'Prêmios e Concursos', color: '#A1FF33', type: TransactionType.income},
    { name: 'Outras Receitas', color: '#FF33FF', type: TransactionType.income},

]

export const initiallizeGlobalCategorie = async(): Promise<Category[]> => {
    const createdCategories: Category[] = [];

    for (const category of globalCategories) {
      try {
        const existing = await prisma.category.findFirst({
            where: {
                name: category.name,
                type: category.type
            }
        })

        if (!existing) {
            const newCategory = await prisma.category.create({data: category});
            console.log(`✅ ${newCategory.name} criada com sucesso!`);
            createdCategories.push(newCategory);
        }else {
            createdCategories.push(existing);
        }


    } catch (error) {
        console.error(`❌ Erro ao criar a categoria`);

      
     
    }}

    console.log('✅ Todas as categorias globais foram inicializadas com sucesso!');
 
        return createdCategories;
    }

