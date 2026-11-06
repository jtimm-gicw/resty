import { initialState, restyReducer } from './restyReducer';

test('request lifecycle saves the complete response to history', () => {
  const started = restyReducer(initialState, { type: 'REQUEST_START',
    request: { method: 'GET', url: 'https://example.com/', body: null } });
  expect(started.loading).toBe(true);
  const response = { ok: true, status: 200, headers: { 'content-type': 'application/json' },
    data: { count: 2, next: 'page2', results: [1, 2] } };
  const completed = restyReducer(started, { type: 'REQUEST_COMPLETE', id: 1, response });
  expect(completed.loading).toBe(false);
  expect(completed.history[0].response.data.next).toBe('page2');
  const selected = restyReducer(completed, { type: 'SELECT_HISTORY', entry: completed.history[0] });
  expect(selected.response.data.count).toBe(2);
});
