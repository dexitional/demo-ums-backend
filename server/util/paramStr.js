"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paramStr = paramStr;
/** Express `req.params` values may be `string[]` for splat routes; normalize for Prisma/SQL. */
function paramStr(v) {
    var _a;
    if (v == null)
        return "";
    return Array.isArray(v) ? ((_a = v[0]) !== null && _a !== void 0 ? _a : "") : v;
}
