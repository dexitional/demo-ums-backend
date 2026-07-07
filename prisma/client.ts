import { PrismaClient } from "@prisma/client";

const { mysqlAdapter } = require("./mysqlAdapter");

declare global {
  // eslint-disable-next-line no-var
  var __prismaUmsa: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  global.__prismaUmsa ??
  new PrismaClient({
    adapter: mysqlAdapter,
  });

if (process.env.NODE_ENV !== "production") {
  global.__prismaUmsa = prisma;
}

