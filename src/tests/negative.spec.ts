import { test, expect } from '@playwright/test';
import { ensureMockServer } from '../fixtures/mockServer';
import { ErrorResponseSchema } from '../schemas/api';

test.describe('CRM negative scenarios', () => {
  test.beforeAll(async () => {
    await ensureMockServer();
  });

  test('returns a validation error for an invalid task route', async ({ request }) => {
    const response = await request.post('/tasks/@?/////????dsfgsdg345097654678');
    expect(response.status()).toBe(400);
    const body = ErrorResponseSchema.parse(await response.json());
    expect(body.error).toContain('Invalid');
  });

  test('returns not found for a company lookup by name', async ({ request }) => {
    const response = await request.get('/companies/name/', { params: { name: 'ggle-112274' } });
    expect(response.status()).toBe(404);
    const body = ErrorResponseSchema.parse(await response.json());
    expect(body.message).toContain('company not found');
  });

  test('returns a valid empty company list when query params are provided', async ({ request }) => {
    const response = await request.get('/companies/', {
      params: {
        start: '0',
        filter: 'null',
        sort: '',
        export: 'false'
      }
    });
    expect(response.status()).toBe(200);
  });
});
