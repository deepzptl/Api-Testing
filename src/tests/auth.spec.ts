import { test, expect } from '@playwright/test';

const isProd = (process.env.TARGET_ENV || 'qa').toLowerCase() === 'prod';

test.describe('Environment smoke checks', () => {
  test('GET / returns a successful HTML page', async ({ request }) => {
    const response = await request.get('/');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');

    const body = await response.text();
    expect(body.length).toBeGreaterThan(0);
  });

  test('AutomationPractice route behaves per environment', async ({ request }) => {
    const response = await request.get('/AutomationPractice/');

    if (isProd) {
      expect(response.status()).toBe(404);
    } else {
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('text/html');
    }
  });
});
