import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './drizzle/schema/*',
  out: './drizzle',
  dialect: 'mysql', // or 'postgresql', 'sqlite'
  dbCredentials: {
    url: process.env.UMS_URL_DRIZZLE!,
  },
});
