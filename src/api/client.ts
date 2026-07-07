import type { APIRequestContext } from '@playwright/test';

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  private getDefaultHeaders() {
    return {
      Accept: 'application/json',
      'Accept-Language': 'en-GB,en;q=0.9,en-US;q=0.8',
      Origin: 'https://ui.cogmento.com',
      Referer: 'https://ui.cogmento.com/',
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'cross-site',
      'Sec-Fetch-Dest': 'empty',
      ...(process.env.TOKEN ? { Authorization: `Token ${process.env.TOKEN}` } : {})
    };
  }

  async get(url: string, options?: Parameters<APIRequestContext['get']>[1]) {
    const mergedOptions = {
      ...(options ?? {}),
      headers: {
        ...this.getDefaultHeaders(),
        ...(options?.headers ?? {})
      }
    } as Parameters<APIRequestContext['get']>[1];

    const response = await this.request.get(url, mergedOptions);
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
        ...this.getDefaultHeaders(),
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
    const mergedOptions = {
      ...(options ?? {}),
      headers: {
        ...this.getDefaultHeaders(),
        ...(options?.headers ?? {})
      }
    } as Parameters<APIRequestContext['delete']>[1];

    const response = await this.request.delete(url, mergedOptions);
    return {
      response,
      body: await response.json().catch(() => null)
    };
  }
}
