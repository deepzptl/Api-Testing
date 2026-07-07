import { test, expect } from '@playwright/test';
import { ensureMockServer } from '../fixtures/mockServer';
import { ContactService } from '../api/services/contactService';

test.describe('CRM contacts API', () => {
  test.beforeAll(async () => {
    await ensureMockServer();
  });

  test('creates, lists, updates, and deletes a contact', async ({ request }) => {
    const contactService = new ContactService(request);
    const payload = { first_name: 'Ada', last_name: 'Lovelace', tags: ['vip'] };

    const createResult = await contactService.create(payload);
    expect(createResult.response.status()).toBe(201);
    expect(createResult.body?.response.result.id).toBeTruthy();

    const listResult = await contactService.list();
    expect(listResult.response.status()).toBe(200);
    expect(listResult.body?.response.result.length).toBeGreaterThan(0);

    const createdId = createResult.body?.response.result.id as string;
    const getResult = await contactService.get(createdId);
    expect(getResult.response.status()).toBe(200);
    expect(getResult.body?.response.result.id).toBe(createdId);

    const updateResult = await contactService.update(createdId, { first_name: 'Ada', last_name: 'Byron' });
    expect(updateResult.response.status()).toBe(201);
    expect(updateResult.body?.response.result.last_name).toBe('Byron');

    const deleteResult = await contactService.delete(createdId);
    expect(deleteResult.response.status()).toBe(200);
    expect(deleteResult.body?.message).toContain('deleted');
  });
});
