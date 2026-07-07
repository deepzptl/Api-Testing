import { test, expect } from '@playwright/test';

test.describe('Environment health checks', () => {
  test('GET / responds successfully for both environments', async ({ request }) => {
    const response = await request.get('/');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
  });

  test('GET /unknown-path is handled gracefully', async ({ request }) => {
    const response = await request.get('/unknown-path');

    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThanOrEqual(404);
  });
});
