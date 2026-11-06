import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../app';
import { STORAGE_KEY } from '../state/restyReducer';

const url = 'https://api.example.test/users/1';
const server = setupServer(
  rest.get(url, (req, res, ctx) => res(ctx.status(200), ctx.set('X-Demo', 'classroom'),
    ctx.json({ name: 'Ada', count: 2, next: 'page2', results: [1, 2] }))),
  rest.post('https://api.example.test/posts', async (req, res, ctx) =>
    res(ctx.status(201), ctx.json({ created: true, title: req.body.title }))),
);
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => { server.resetHandlers(); localStorage.clear(); });
afterAll(() => server.close());

function submitGet() {
  fireEvent.change(screen.getByLabelText('API URL'), { target: { value: url } });
  fireEvent.click(screen.getByRole('button', { name: 'GO!' }));
}

test('renders initial components and default GET method', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'RESTy' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'GET' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByText('No requests made yet.')).toBeInTheDocument();
});

test('GET displays response, headers, complete JSON and clickable history', async () => {
  render(<App />);
  submitGet();
  await waitFor(() => expect(document.querySelector('#json-pretty').textContent).toContain('Ada'));
  expect(document.querySelector('#json-pretty').textContent).toContain('page2');
  expect(document.querySelector('#response-headers').textContent.toLowerCase()).toContain('x-demo');
  expect(screen.getByText(/HTTP 200/)).toBeInTheDocument();
  const historyButton = screen.getByRole('button', { name: /Show saved result for GET/ });
  fireEvent.click(historyButton);
  expect(document.querySelector('#json-pretty').textContent).toContain('Ada');
});

test('POST sends JSON object instead of double-encoded JSON string', async () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'POST' }));
  fireEvent.change(screen.getByLabelText('API URL'), { target: { value: 'https://api.example.test/posts' } });
  fireEvent.change(screen.getByLabelText('JSON request body'), { target: { value: '{"title":"Practice"}' } });
  fireEvent.click(screen.getByRole('button', { name: 'GO!' }));
  await waitFor(() => expect(document.querySelector('#json-pretty').textContent).toContain('Practice'));
  expect(screen.getByText(/HTTP 201/)).toBeInTheDocument();
});

test('invalid JSON gives feedback and does not issue request', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'POST' }));
  fireEvent.change(screen.getByLabelText('API URL'), { target: { value: 'https://api.example.test/posts' } });
  fireEvent.change(screen.getByLabelText('JSON request body'), { target: { value: '{bad json' } });
  fireEvent.click(screen.getByRole('button', { name: 'GO!' }));
  expect(screen.getByRole('alert')).toHaveTextContent('valid JSON');
});

test('HTTP error response is shown rather than falsely treated as successful', async () => {
  server.use(rest.get(url, (req, res, ctx) => res(ctx.status(404), ctx.json({ message: 'Not found' }))));
  render(<App />);
  submitGet();
  await waitFor(() => expect(screen.getByText(/HTTP 404/)).toBeInTheDocument());
  expect(document.querySelector('#json-pretty').textContent).toContain('Not found');
});

test('saved history is restored from localStorage on load', async () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([{ id: 99, date: '2026-11-01',
    method: 'GET', url, body: null,
    response: { ok: true, status: 200, statusText: 'OK', headers: {}, data: { saved: true } } }]));
  render(<App />);
  expect(await screen.findByRole('button', { name: /Show saved result for GET/ })).toBeInTheDocument();
});
