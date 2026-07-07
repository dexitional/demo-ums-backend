"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
// import { PrismaClient } from "../prisma/client";
//import sha1 from "sha1";
const { mysqlAdapter } = require("../../prisma/mysqlAdapter");
const ais = new client_1.PrismaClient({ adapter: mysqlAdapter });
const sha1 = require('sha1');
const { customAlphabet } = require("nanoid");
const pwdgen = customAlphabet("1234567890abcdefghijklmnopqrstuvwzyx", 6);
class MisController {
    fetchTest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tag = 'Kobby Blayssadsad';
                const resp = yield ais.election.findMany({
                    // where: { status: true, voterList: { path: '$[*].tag', equals: tag }},
                    // where: { status: true, voterList: { path: '$[*]', equals: tag }},
                    // where: { voterList: { equals: tag }},
                    // where: { voterList: { array_contains: tag }},
                    // where: { voterData: { array_contains: tag }},
                    where: { voterData: { path: '$.tag', array_contains: tag } },
                });
                console.log(resp);
                if (resp === null || resp === void 0 ? void 0 : resp.length) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(204).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchElections(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.election.findMany();
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(204).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.default = MisController;
