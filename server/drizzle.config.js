"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_kit_1 = require("drizzle-kit");
exports.default = (0, drizzle_kit_1.defineConfig)({
    schema: './drizzle/schema/*',
    out: './drizzle',
    dialect: 'mysql', // or 'postgresql', 'sqlite'
    dbCredentials: {
        url: process.env.UMS_URL_DRIZZLE,
    },
});
