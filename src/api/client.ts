import type { APIRequestContext } from '@playwright/test';

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async get(url: string, options?: Parameters<APIRequestContext['get']>[1]) {
    const response = await this.request.get(url, options);
    return {
      response,
      body: await response.json().catch(() => null)
    };
  }

  async post(url: string, data: unknown, options?: Parameters<APIRequestContext['post']>[1]) {
    const response = await this.request.post(url, {
      ...(options ?? {}),
      data: typeof data === 'string' ? data : JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers ?? {})
      }
    });
    return {
      response,
      body: await response.json().catch(() => null)
    };
  }

  async delete(url: string, options?: Parameters<APIRequestContext['delete']>[1]) {
    const response = await this.request.delete(url, options);
    return {
      response,
      body: await response.json().catch(() => null)
    };
  }
}
