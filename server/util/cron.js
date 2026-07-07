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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCronJobs = runCronJobs;
const backup_1 = require("./backup");
const node_cron_1 = __importDefault(require("node-cron"));
function runCronJobs() {
    // Scheduled Backup at Midnight
    node_cron_1.default.schedule('0 0 * * *', () => __awaiter(this, void 0, void 0, function* () {
        console.log('Starting scheduled backup...');
        const result = yield (0, backup_1.performBackup)();
        if (result.success) {
            console.log('Scheduled backup completed successfully');
        }
        else {
            console.error('Scheduled backup failed:', result.error);
        }
    }));
}
