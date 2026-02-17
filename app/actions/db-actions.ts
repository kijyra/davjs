'use server'

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg'; 

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function getTableData(tableName: string) {
  const modelName = tableName.toLowerCase(); 
  const table = (prisma as any)[modelName] || (prisma as any)[tableName];
  if (!table) throw new Error(`Model ${modelName} not found in Prisma`);
  return await table.findMany();
}