/** Optional localhost-only fixture service for manual browser smoke checks. */
import { createServer } from 'node:http';
import process from 'node:process';
import { getFixtureResponse } from './api-fixtures';

createServer(async (request, response) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, apifoxToken');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Content-Type', 'application/json');
  if (request.method === 'OPTIONS') {
    response.writeHead(204).end();
    return;
  }
  try {
    let rawBody = '';
    for await (const chunk of request) rawBody += chunk;
    const url = new URL(request.url || '/', 'http://127.0.0.1:9530');
    const result = getFixtureResponse(url, rawBody ? JSON.parse(rawBody) : undefined);
    response.writeHead(result ? 200 : 501).end(JSON.stringify(result || { code: '501', msg: 'Missing fixture' }));
  } catch {
    response.writeHead(400).end(JSON.stringify({ code: '400', msg: 'Invalid fixture request' }));
  }
}).listen(9530, '127.0.0.1', () => {
  process.stdout.write('Synthetic E2E fixture API listening at http://127.0.0.1:9530\n');
});
