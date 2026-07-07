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
  private readonly baseUrl: string;

  constructor(request: APIRequestContext, baseUrl?: string) {
    this.api = new ApiClient(request);
    this.baseUrl = baseUrl ?? '';
  }

  private normalizeSingleResponse(body: unknown) {
    const parsed = ContactResponseSchema.parse(body);
    const record = parsed.response.result ?? parsed.response.results;
    return {
      ...parsed,
      response: {
        ...parsed.response,
        result: record
      }
    };
  }

  private normalizeListResponse(body: unknown) {
    const parsed = ContactsListResponseSchema.parse(body);
    const records = parsed.response.result ?? parsed.response.results ?? [];
    return {
      ...parsed,
      response: {
        ...parsed.response,
        result: records
      }
    };
  }

  async create(payload: ContactPayload) {
    ContactPayloadSchema.parse(payload);
    const url = this.baseUrl ? `${this.baseUrl}/contacts/` : '/contacts/';
    const result = await this.api.post(url, payload);
    return {
      ...result,
      body: result.body ? this.normalizeSingleResponse(result.body) : null
    };
  }

  async list() {
    const url = this.baseUrl ? `${this.baseUrl}/contacts/` : '/contacts/';
    const result = await this.api.get(url);
    return {
      ...result,
      body: result.body ? this.normalizeListResponse(result.body) : null
    };
  }

  async get(id: string) {
    const url = this.baseUrl ? `${this.baseUrl}/contacts/${id}/` : `/contacts/${id}/`;
    const result = await this.api.get(url);
    return {
      ...result,
      body: result.body ? this.normalizeSingleResponse(result.body) : null
    };
  }

  async update(id: string, payload: Partial<ContactPayload>) {
    const url = this.baseUrl ? `${this.baseUrl}/contacts/${id}/` : `/contacts/${id}/`;
    const result = await this.api.post(url, payload);
    return {
      ...result,
      body: result.body ? this.normalizeSingleResponse(result.body) : null
    };
  }

  async delete(id: string) {
    const url = this.baseUrl ? `${this.baseUrl}/contacts/${id}/?purge=false` : `/contacts/${id}/?purge=false`;
    return this.api.delete(url);
  }
}
