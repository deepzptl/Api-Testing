import { test, expect } from '@playwright/test';
import { ensureMockServer } from '../fixtures/mockServer';
import { CompanyService } from '../api/services/companyService';

test.describe('CRM companies API', () => {
  test.beforeAll(async () => {
    await ensureMockServer();
  });

  test('creates, reads, updates, and deletes a company', async ({ request }) => {
    const companyService = new CompanyService(request);
    const payload = { name: 'Acme Corp', industry: 'Software', phone: '1234567890' };

    const createResult = await companyService.create(payload);
    expect(createResult.response.status()).toBe(201);
    expect(createResult.body?.response.result.id).toBeTruthy();

    const createdId = createResult.body?.response.result.id as string;
    const getResult = await companyService.get(createdId);
    expect(getResult.response.status()).toBe(200);
    expect(getResult.body?.response.result.name).toBe('Acme Corp');

    const updateResult = await companyService.update(createdId, { phone: '9999999999' });
    expect(updateResult.response.status()).toBe(201);
    expect(updateResult.body?.response.result.phone).toBe('9999999999');

    const deleteResult = await companyService.delete(createdId);
    expect(deleteResult.response.status()).toBe(200);
    expect(deleteResult.body?.message).toContain('deleted');
  });
});
