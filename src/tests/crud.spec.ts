import { test, expect } from '@playwright/test';
import { CompanyService } from '../api/services/companyService';
import { ContactService } from '../api/services/contactService';

const CRM_BASE = (process.env.CRM_BASE_URL || 'https://api.freecrm.com/api/1').replace(/\/$/, '');
const CRM_AUTH_URL = (process.env.CRM_AUTH_URL || `${CRM_BASE}/auth`).replace(/\/$/, '');
const email = process.env.CRM_EMAIL || 'deep.patel@simformsolutions.com';
const password = process.env.CRM_PASSWORD || 'Dpatel@1';

test.describe.serial('CRM full CRUD flows (uses Postman collection contract)', () => {
  test.beforeAll(async ({ request }) => {
    const res = await request.post(CRM_AUTH_URL, {
      data: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Language': 'en-GB,en;q=0.9,en-US;q=0.8',
        Origin: 'https://ui.cogmento.com',
        Referer: 'https://ui.cogmento.com/',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0'
      }
    });

    if (res.status() < 200 || res.status() >= 300) {
      test.skip(true, `CRM auth endpoint not reachable (${res.status()}): ${CRM_AUTH_URL}`);
    }

    const body = await res.json().catch(() => null);
    const token = body?.response?.token ?? body?.token ?? body?.response ?? null;
    if (!token) {
      test.skip(true, 'CRM auth returned no token');
    }
    process.env.TOKEN = token;
  });

  test('Company CRUD', async ({ request }) => {
    const svc = new CompanyService(request, CRM_BASE);
    const payload = { name: `e2e-company-${Date.now()}`, industry: 'Software' };

    const create = await svc.create(payload);
    expect(create.response.status()).toBe(201);
    const companyId = create.body?.response.result.id as string;
    expect(companyId).toBeTruthy();

    const read = await svc.get(companyId);
    expect(read.response.status()).toBe(200);
    expect(read.body?.response.result.name).toBe(payload.name);

    const update = await svc.update(companyId, { phone: '9999999999' });
    expect([200, 201].includes(update.response.status())).toBeTruthy();

    const del = await svc.delete(companyId);
    expect([200, 204].includes(del.response.status())).toBeTruthy();
  });

  test('Contact CRUD', async ({ request }) => {
    const svc = new ContactService(request, CRM_BASE);
    const payload = { first_name: 'Meet', last_name: `Patel-${Date.now()}` };

    const create = await svc.create(payload);
    expect(create.response.status()).toBe(201);
    const contactId = create.body?.response.result.id as string;
    expect(contactId).toBeTruthy();

    const list = await svc.list();
    expect(list.response.status()).toBe(200);

    const read = await svc.get(contactId);
    expect(read.response.status()).toBe(200);

    const update = await svc.update(contactId, { last_name: 'Updated' });
    expect([200, 201].includes(update.response.status())).toBeTruthy();

    const del = await svc.delete(contactId);
    expect([200, 204].includes(del.response.status())).toBeTruthy();
  });

  test('Negative cases from collection', async ({ request }) => {
    // Invalid task path should return client/server error
    const invalid = await request.post(`${CRM_BASE}/tasks/@?/////????dsfgsdg345097654678`, {
      data: JSON.stringify({ title: 'Complete Assignment - 2', tags: [] }),
      headers: { 'Content-Type': 'application/json' }
    });
    expect(invalid.status()).toBeGreaterThanOrEqual(400);

    // Invalid company name lookup - expect not-200
    const companyLookup = await request.get(`${CRM_BASE}/companies/name/?name=ggle-112274`);
    expect(companyLookup.status()).not.toBe(200);
  });
});
