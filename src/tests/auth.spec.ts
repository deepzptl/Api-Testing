import { test, expect } from '@playwright/test';
import { ensureMockServer } from '../fixtures/mockServer';
import { AuthService } from '../api/services/authService';

test.describe('CRM auth API', () => {
  test.beforeAll(async () => {
    await ensureMockServer();
  });

  test('logs in and logs out successfully', async ({ request }) => {
    const authService = new AuthService(request);
    const loginResult = await authService.login({ username: 'admin', password: 'password' });

    expect(loginResult.response.status()).toBe(200);
    expect(loginResult.body?.token).toBe('mock-token');

    const logoutResult = await authService.logout();
    expect(logoutResult.response.status()).toBe(200);
    expect(logoutResult.body?.message).toContain('logged out');
  });
});
