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

  constructor(request: APIRequestContext) {
    this.api = new ApiClient(request);
  }

  async create(payload: CompanyPayload) {
    CompanyPayloadSchema.parse(payload);
    const result = await this.api.post('/companies/', payload);
    return {
      ...result,
      body: result.body ? CompanyResponseSchema.parse(result.body) : null
    };
  }

  async get(id: string) {
    const result = await this.api.get(`/companies/${id}/`);
    return {
      ...result,
      body: result.body ? CompanyResponseSchema.parse(result.body) : null
    };
  }

  async update(id: string, payload: Partial<CompanyPayload>) {
    const result = await this.api.post(`/companies/${id}/`, payload);
    return {
      ...result,
      body: result.body ? CompanyResponseSchema.parse(result.body) : null
    };
  }

  async delete(id: string) {
    return this.api.delete(`/companies/${id}/?purge=false`);
  }
}
