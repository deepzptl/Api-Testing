import type { APIRequestContext } from '@playwright/test';
import { ApiClient } from '../client';
import { AuthPayloadSchema, AuthResponseSchema, type AuthPayload } from '../../schemas/api';

export class AuthService {
  private readonly api: ApiClient;

  constructor(request: APIRequestContext) {
    this.api = new ApiClient(request);
  }

  async login(payload: AuthPayload) {
    AuthPayloadSchema.parse(payload);
    const result = await this.api.post('/auth/', payload);
    return {
      ...result,
      body: result.body ? AuthResponseSchema.parse(result.body) : null
    };
  }

  async logout() {
    return this.api.get('/auth/logout/?purge=true');
  }
}
