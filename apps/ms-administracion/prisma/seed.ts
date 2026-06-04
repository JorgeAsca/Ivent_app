import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL no está definida en las variables de entorno');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});



async function main() {
  console.log(' Iniciando Seed adaptado...');

  // Crear Empresa
  const empresa = await prisma.empresa.upsert({
    where: { nif_cif: 'B12345678' },
    update: {},
    create: {
      nombre_legal: 'Ivent Corp S.L.',
      nombre_comercial: 'Ivent App',
      nif_cif: 'B12345678',
    },
  });

  console.log(' Seed completado. Empresa ID:', empresa.id_empresa);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });