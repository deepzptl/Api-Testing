import http from 'http';
import type { AddressInfo } from 'net';
import {
  AuthPayloadSchema,
  CompanyPayloadSchema,
  ContactPayloadSchema,
  type ContactRecord,
  type CompanyRecord
} from '../schemas/api';

let server: http.Server | null = null;
let baseUrl = 'http://127.0.0.1:4100';

const state = {
  contacts: [] as ContactRecord[],
  companies: [] as CompanyRecord[],
  token: null as string | null
};

function jsonResponse(res: http.ServerResponse, status: number, body: unknown) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function readJsonBody(req: http.IncomingMessage): Promise<unknown> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      resolve(body ? JSON.parse(body) : {});
    });
  });
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export async function ensureMockServer() {
  if (server) {
    return baseUrl;
  }

  server = http.createServer((req, res) => {
    const url = new URL(req.url ?? '/', baseUrl);

    if (req.method === 'POST' && url.pathname === '/auth/') {
      void readJsonBody(req).then((payload) => {
        try {
          const body = AuthPayloadSchema.parse(payload);
          state.token = body.username && body.password ? 'mock-token' : null;
          jsonResponse(res, 200, { token: state.token });
        } catch (error) {
          jsonResponse(res, 400, { error: 'Invalid auth payload' });
        }
      });
      return;
    }

    if (req.method === 'GET' && url.pathname === '/auth/logout/') {
      state.token = null;
      jsonResponse(res, 200, { message: 'logged out' });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/contacts/') {
      void readJsonBody(req).then((payload) => {
        try {
          const body = ContactPayloadSchema.parse(payload);
          const contact: ContactRecord = {
            id: createId('contact'),
            ...body,
            tags: body.tags ?? []
          };
          state.contacts.push(contact);
          jsonResponse(res, 201, { response: { result: contact } });
        } catch (error) {
          jsonResponse(res, 400, { error: 'Invalid contact payload' });
        }
      });
      return;
    }

    if (req.method === 'GET' && url.pathname === '/contacts/') {
      jsonResponse(res, 200, { response: { result: state.contacts } });
      return;
    }

    if (req.method === 'GET' && url.pathname.startsWith('/contacts/') && url.pathname.endsWith('/') && url.pathname.split('/').filter(Boolean).length > 1) {
      const id = url.pathname.split('/').filter(Boolean)[1];
      const existing = state.contacts.find((item) => item.id === id);
      if (!existing) {
        jsonResponse(res, 404, { message: 'contact not found' });
        return;
      }
      jsonResponse(res, 200, { response: { result: existing } });
      return;
    }

    if (req.method === 'POST' && url.pathname.startsWith('/contacts/') && url.pathname.endsWith('/')) {
      const id = url.pathname.split('/').filter(Boolean)[1];
      void readJsonBody(req).then((payload) => {
        const body = payload as Partial<ContactPayload>;
        const existing = state.contacts.find((item) => item.id === id);
        if (!existing) {
          jsonResponse(res, 404, { message: 'contact not found' });
          return;
        }
        Object.assign(existing, body);
        jsonResponse(res, 201, { response: { result: existing } });
      });
      return;
    }

    if (req.method === 'DELETE' && url.pathname.startsWith('/contacts/') && url.pathname.includes('/')) {
      const id = url.pathname.split('/').filter(Boolean)[1];
      const index = state.contacts.findIndex((item) => item.id === id);
      if (index === -1) {
        jsonResponse(res, 404, { message: 'contact not found' });
        return;
      }
      state.contacts.splice(index, 1);
      jsonResponse(res, 200, { message: 'contact deleted' });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/companies/') {
      void readJsonBody(req).then((payload) => {
        try {
          const body = CompanyPayloadSchema.parse(payload);
          const company: CompanyRecord = {
            id: createId('company'),
            ...body
          };
          state.companies.push(company);
          jsonResponse(res, 201, { response: { result: company } });
        } catch (error) {
          jsonResponse(res, 400, { error: 'Invalid company payload' });
        }
      });
      return;
    }

    if (req.method === 'GET' && url.pathname.startsWith('/companies/') && url.pathname.endsWith('/') && url.pathname.split('/').filter(Boolean).length > 1) {
      const id = url.pathname.split('/').filter(Boolean)[1];
      const company = state.companies.find((item) => item.id === id);
      if (!company) {
        jsonResponse(res, 404, { message: 'company not found' });
        return;
      }
      jsonResponse(res, 200, { response: { result: company } });
      return;
    }

    if (req.method === 'POST' && url.pathname.startsWith('/companies/') && url.pathname.endsWith('/')) {
      const id = url.pathname.split('/').filter(Boolean)[1];
      void readJsonBody(req).then((payload) => {
        const body = payload as Partial<CompanyPayload>;
        const existing = state.companies.find((item) => item.id === id);
        if (!existing) {
          jsonResponse(res, 404, { message: 'company not found' });
          return;
        }
        Object.assign(existing, body);
        jsonResponse(res, 201, { response: { result: existing } });
      });
      return;
    }

    if (req.method === 'DELETE' && url.pathname.startsWith('/companies/') && url.pathname.includes('/')) {
      const id = url.pathname.split('/').filter(Boolean)[1];
      const index = state.companies.findIndex((item) => item.id === id);
      if (index === -1) {
        jsonResponse(res, 404, { message: 'company not found' });
        return;
      }
      state.companies.splice(index, 1);
      jsonResponse(res, 200, { message: 'company deleted' });
      return;
    }

    if (req.method === 'POST' && url.pathname.includes('/tasks/')) {
      jsonResponse(res, 400, { error: 'Invalid request path' });
      return;
    }

    if (req.method === 'GET' && url.pathname.startsWith('/companies')) {
      const segments = url.pathname.split('/').filter(Boolean);
      if (segments[1] === 'name') {
        jsonResponse(res, 404, { message: 'company not found' });
        return;
      }

      if (segments.length <= 1) {
        jsonResponse(res, 200, { response: { result: state.companies } });
        return;
      }
    }

    jsonResponse(res, 404, { message: 'not found' });
  });

  await new Promise<void>((resolve) => {
    server.listen(4100, '127.0.0.1', () => resolve());
  });

  const address = server.address();
  if (address && typeof address !== 'string') {
    baseUrl = `http://127.0.0.1:${(address as AddressInfo).port}`;
  }

  return baseUrl;
}

export function getMockBaseUrl() {
  return baseUrl;
}
