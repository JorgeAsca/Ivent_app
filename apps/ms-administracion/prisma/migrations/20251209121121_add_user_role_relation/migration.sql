-- CreateTable
CREATE TABLE "Empresa" (
    "id_empresa" TEXT NOT NULL,
    "nombre_legal" TEXT NOT NULL,
    "nombre_comercial" TEXT,
    "nif_cif" TEXT NOT NULL,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id_empresa")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id_usuario" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "rolId" TEXT,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "Rol" (
    "id_rol" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "Permiso" (
    "id_permiso" TEXT NOT NULL,
    "recurso" TEXT NOT NULL,
    "accion" TEXT NOT NULL,

    CONSTRAINT "Permiso_pkey" PRIMARY KEY ("id_permiso")
);

-- CreateTable
CREATE TABLE "RolPermiso" (
    "id_rol" TEXT NOT NULL,
    "id_permiso" TEXT NOT NULL,

    CONSTRAINT "RolPermiso_pkey" PRIMARY KEY ("id_rol","id_permiso")
);

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_nif_cif_key" ON "Empresa"("nif_cif");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id_rol") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rol" ADD CONSTRAINT "Rol_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolPermiso" ADD CONSTRAINT "RolPermiso_id_permiso_fkey" FOREIGN KEY ("id_permiso") REFERENCES "Permiso"("id_permiso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolPermiso" ADD CONSTRAINT "RolPermiso_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "Rol"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;
