import { PrismaClient } from "$/generated/prisma";

// Declara un tipo global para `prismaGlobal` y así evitar errores de TypeScript.
// Le dice a TypeScript que el objeto global puede contener nuestra instancia de Prisma.
declare const globalThis: {
  prismaGlobal: PrismaClient | undefined;
} & typeof global;

// Crea la instancia de Prisma.
// Reutiliza la instancia global (`prismaGlobal`) si ya existe.
// Si no, crea una nueva instancia de `PrismaClient`.
const db = globalThis.prismaGlobal ?? new PrismaClient();

// Exporta la instancia única del cliente de Prisma para que se use en toda la aplicación.
export default db;

// Solo en entorno de desarrollo, guarda la instancia en el objeto global.
// Esto es clave para que la conexión a la base de datos persista
// entre las recargas en caliente (HMR) de Next.js.
if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = db;
