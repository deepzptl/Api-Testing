import type { APIRequestContext } from '@playwright/test';
import { ApiClient } from '../client';
import {
  ContactPayloadSchema,
  ContactResponseSchema,
  ContactsListResponseSchema,
  type ContactPayload,
  type ContactRecord
} from '../../schemas/api';

export class ContactService {
  private readonly api: ApiClient;

  constructor(request: APIRequestContext) {
    this.api = new ApiClient(request);
  }

  async create(payload: ContactPayload) {
    ContactPayloadSchema.parse(payload);
    const result = await this.api.post('/contacts/', payload);
    return {
      ...result,
      body: result.body ? ContactResponseSchema.parse(result.body) : null
    };
  }

  async list() {
    const result = await this.api.get('/contacts/');
    return {
      ...result,
      body: result.body ? ContactsListResponseSchema.parse(result.body) : null
    };
  }

  async get(id: string) {
    const result = await this.api.get(`/contacts/${id}/`);
    return {
      ...result,
      body: result.body ? ContactResponseSchema.parse(result.body) : null
    };
  }

  async update(id: string, payload: Partial<ContactPayload>) {
    const result = await this.api.post(`/contacts/${id}/`, payload);
    return {
      ...result,
      body: result.body ? ContactResponseSchema.parse(result.body) : null
    };
  }

  async delete(id: string) {
    return this.api.delete(`/contacts/${id}/?purge=false`);
  }
}
