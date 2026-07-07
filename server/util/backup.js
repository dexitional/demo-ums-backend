"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.performBackup = performBackup;
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
function performBackup() {
    return new Promise((resolve) => {
        const file = `backup-${new Date().toISOString().replace(/:/g, '-')}.sql`;
        const cmd = `mysqldump -u${process.env.DB_USER} -p${process.env.DB_PASS} --host=${process.env.DB_HOST} ${process.env.DB_NAME} > ./backup/${file}`;
        (0, child_process_1.exec)(cmd, (error, stdout, stderr) => {
            if (error || stderr) {
                return resolve({ success: false, error: error || stderr });
            }
            // double check the file was created
            fs_1.default.access(`./backup/${file}`, fs_1.default.constants.F_OK, (err) => {
                if (err) {
                    return resolve({ success: false, error: "Backup file not created." });
                }
                resolve({ success: true, file });
            });
        });
    });
}
