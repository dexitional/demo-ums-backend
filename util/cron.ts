import { performBackup } from "./backup";
import cron from 'node-cron';


export function runCronJobs() {
    // Scheduled Backup at Midnight
    cron.schedule('0 0 * * *', async () => {
        console.log('Starting scheduled backup...');
        const result = await performBackup();
        if (result.success) {
          console.log('Scheduled backup completed successfully');
        } else {
          console.error('Scheduled backup failed:', result.error);
        }
    });

}