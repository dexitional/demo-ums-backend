import { exec } from 'child_process';
import fs from 'fs';

type BackupResult = 
  | { success: true; file: string }
  | { success: false; error: string | Error };

export function performBackup(): Promise<BackupResult> {
  return new Promise((resolve) => {
    const file = `backup-${new Date().toISOString().replace(/:/g, '-')}.sql`;
    const cmd = `mysqldump -u${process.env.DB_USER} -p${process.env.DB_PASS} --host=${process.env.DB_HOST} ${process.env.DB_NAME} > ./backup/${file}`;
    exec(cmd, (error: Error | null, stdout: string, stderr: string) => {
      if (error || stderr) {
        return resolve({ success: false, error: error || stderr });
      }
      // double check the file was created
      fs.access(`./backup/${file}`, fs.constants.F_OK, (err: NodeJS.ErrnoException | null) => {
        if (err) {
          return resolve({ success: false, error: "Backup file not created." });
        }
        resolve({ success: true, file });
      });
    });
  });
}