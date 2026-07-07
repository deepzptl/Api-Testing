import type { APIRequestContext } from '@playwright/test';
import { ApiClient } from '../client';
import {
  CompanyPayloadSchema,
  CompanyResponseSchema,
  type CompanyPayload,
  type CompanyRecord
} from '../../schemas/api';

export class CompanyService {
  private readonly api: ApiClient;
  private readonly baseUrl: string;

  constructor(request: APIRequestContext, baseUrl?: string) {
    this.api = new ApiClient(request);
    this.baseUrl = baseUrl ?? '';
  }

  private normalizeSingleResponse(body: unknown) {
    const parsed = CompanyResponseSchema.parse(body);
    const record = parsed.response.result ?? parsed.response.results;
    return {
      ...parsed,
      response: {
        ...parsed.response,
        result: record
      }
    };
  }

  async create(payload: CompanyPayload) {
    CompanyPayloadSchema.parse(payload);
    const url = this.baseUrl ? `${this.baseUrl}/companies/` : '/companies/';
    const result = await this.api.post(url, payload);
    return {
      ...result,
      body: result.body ? this.normalizeSingleResponse(result.body) : null
    };
  }

  async get(id: string) {
    const url = this.baseUrl ? `${this.baseUrl}/companies/${id}/` : `/companies/${id}/`;
    const result = await this.api.get(url);
    return {
      ...result,
      body: result.body ? this.normalizeSingleResponse(result.body) : null
    };
  }

  async update(id: string, payload: Partial<CompanyPayload>) {
    const url = this.baseUrl ? `${this.baseUrl}/companies/${id}/` : `/companies/${id}/`;
    const result = await this.api.post(url, payload);
    return {
      ...result,
      body: result.body ? this.normalizeSingleResponse(result.body) : null
    };
  }

  async delete(id: string) {
    const url = this.baseUrl ? `${this.baseUrl}/companies/${id}/?purge=false` : `/companies/${id}/?purge=false`;
    return this.api.delete(url);
  }
}
