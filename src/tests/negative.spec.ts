import { test, expect } from '@playwright/test';

test.describe('Negative environment checks', () => {
  test('invalid route is handled gracefully on both environments', async ({ request }) => {
    const response = await request.get('/invalid-route');

    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThanOrEqual(404);
  });

  test('root endpoint is reachable on both environments', async ({ request }) => {
    const response = await request.get('/');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
  });
});
