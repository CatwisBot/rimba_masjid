import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  var _prismaPool: Pool | undefined;
  var _prismaClient: PrismaClient | undefined;
}

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not defined. Check your .env file has DATABASE_URL set."
    );
  }
  return new Pool({ connectionString });
}

function getPrismaClient(): PrismaClient {
  if (global._prismaClient) return global._prismaClient;

  if (!global._prismaPool) {
    global._prismaPool = createPool();
  }

  const adapter = new PrismaPg(global._prismaPool);
  const client = new PrismaClient({ adapter });
  global._prismaClient = client;
  return client;
}

const prisma = getPrismaClient();

export default prisma;
