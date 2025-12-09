import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log(' Iniciando Seed adaptado...');

  const permiso = await prisma.permiso.create({
    data: { 
      recurso: 'usuarios', 
      accion: 'crear' 
    },
  });

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

  // Crear Rol
  const rolAdmin = await prisma.rol.create({
    data: {
      nombre: 'Super Admin',
      empresaId: empresa.id_empresa, 
      
      permisos: {
        create: [
          { permiso: { connect: { id_permiso: permiso.id_permiso } } }
        ]
      }
    },
  });

  // Crear Usuario
  await prisma.usuario.upsert({
    where: { email: 'admin@ivent.app' },
    update: {},
    create: {
      email: 'admin@ivent.app',
      password: await bcrypt.hash('admin123', 10),
      nombre: 'Jorge Admin',
      empresaId: empresa.id_empresa,
    },
  });

  console.log(' Seed completado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });