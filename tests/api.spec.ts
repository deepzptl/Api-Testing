import { test, expect, type APIRequestContext } from '@playwright/test';

type BookPayload = {
  name: string;
  isbn: string;
  aisle: string;
  author: string;
};

type BookResponse = {
  Msg?: string;
  ID?: string;
};

async function createBook(request: APIRequestContext, payload: BookPayload) {
  return request.post('/Library/Addbook.php', {
    data: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

test.describe('RahulShetty Academy API automation', () => {
  test('GET / returns a valid HTML page', async ({ request }) => {
    const response = await request.get('/');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');

    const body = await response.text();
    expect(body.length).toBeGreaterThan(100);
    expect(body.toLowerCase()).toContain('rahul');
  });

  test('GET /AutomationPractice/ returns a success response', async ({ request }) => {
    const response = await request.get('/AutomationPractice/');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
  });

  test('GET /Library/GetBook.php returns books for a known author', async ({ request }) => {
    const response = await request.get('/Library/GetBook.php', {
      params: {
        AuthorName: 'Rahul Shetty'
      }
    });

    expect(response.status()).toBe(200);
    const books = await response.json();

    expect(Array.isArray(books)).toBeTruthy();
    expect(books.length).toBeGreaterThan(0);
    expect(books[0]).toHaveProperty('book_name');
  });

  test('POST /Library/Addbook.php and DELETE /Library/DeleteBook.php work end to end', async ({ request }) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const payload: BookPayload = {
      name: 'TypeScript Playwright API',
      isbn: `ts${timestamp}`,
      aisle: `${timestamp}`,
      author: 'Copilot'
    };

    const addResponse = await createBook(request, payload);
    const addBody = await addResponse.json<BookResponse>();

    expect(addResponse.status()).toBe(200);
    expect(addBody.Msg).toContain('successfully added');
    expect(addBody.ID).toContain(payload.isbn + payload.aisle);

    const deleteResponse = await request.post('/Library/DeleteBook.php', {
      data: JSON.stringify({
        ID: addBody.ID
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const deleteBody = await deleteResponse.json<{ msg?: string }>();

    expect(deleteResponse.status()).toBe(200);
    expect(deleteBody.msg).toContain('deleted');
  });
});
