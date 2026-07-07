"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const { mysqlAdapter } = require("./mysqlAdapter");
exports.prisma = (_a = global.__prismaUmsa) !== null && _a !== void 0 ? _a : new client_1.PrismaClient({
    adapter: mysqlAdapter,
});
if (process.env.NODE_ENV !== "production") {
    global.__prismaUmsa = exports.prisma;
}
