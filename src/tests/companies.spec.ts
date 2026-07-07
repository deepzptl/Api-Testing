import { test, expect } from '@playwright/test';

test.describe('Environment response checks', () => {
  test('GET / returns HTML content from the configured environment', async ({ request }) => {
    const response = await request.get('/');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
  });

  test('GET /does-not-exist is handled gracefully', async ({ request }) => {
    const response = await request.get('/does-not-exist');

    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThanOrEqual(404);
  });
});
