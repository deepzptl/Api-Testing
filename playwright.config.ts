import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), process.env.ENV_FILE || '.env') });

const environment = (process.env.TARGET_ENV || 'qa').toLowerCase();
const baseURL =
  environment === 'prod'
    ? process.env.BASE_URL_PROD || ''
    : process.env.BASE_URL_QA || '';

export default defineConfig({
  testDir: './src/tests',
  timeout: 30_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    extraHTTPHeaders: {
      Accept: 'application/json, text/plain, */*'
    }
  }
});
