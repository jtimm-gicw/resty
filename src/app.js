import React, { useReducer, useEffect } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Form from './components/Form/Form';
import Results from './components/Results/Results';
import History from './components/History/History';
import { initialState, restyReducer, STORAGE_KEY } from './state/restyReducer';
import { sendRequest, validateRequest } from './api/request';
import './app.scss';

export default function App() {
  // Phase 4: useReducer coordinates request, response, loading and history.
  const [state, dispatch] = useReducer(restyReducer, initialState);

  const submitRequest = () => {
    try {
      const request = validateRequest(state.draft);
      dispatch({ type: 'REQUEST_START', request });
    } catch (error) {
      dispatch({ type: 'FORM_ERROR', message: error.message });
    }
  };

  // Phase 3: when request STATE changes, useEffect sends the HTTP request.
  // Cleanup aborts stale requests if the user submits another one.
  useEffect(() => {
    if (!state.request) return undefined;
    const controller = new AbortController();
    let active = true;
    const { id } = state.request;
    sendRequest(state.request, controller.signal)
      .then((response) => {
        if (active) dispatch({ type: 'REQUEST_COMPLETE', id, response });
      })
      .catch((error) => {
        if (active && error.name !== 'AbortError') {
          dispatch({ type: 'REQUEST_FAILED', id, message: error.message || 'Network request failed.' });
        }
      });
    return () => { active = false; controller.abort(); };
  }, [state.request]);

  // Phase 4 stretch: load and persist history locally; never store API secrets here.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      dispatch({ type: 'HYDRATE_HISTORY', history: Array.isArray(saved) ? saved.slice(0, 50) : [] });
    } catch (_) {
      dispatch({ type: 'HYDRATE_HISTORY', history: [] });
    }
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.history)); } catch (_) { /* storage may be blocked */ }
  }, [state.history, state.hydrated]);

  return (
    <>
      <Header />
      <main className="app-shell">
        <p className="subtitle">Explore REST APIs with React — Components → State → Effects → Reducers</p>
        <Form draft={state.draft} dispatch={dispatch} onSubmit={submitRequest} loading={state.loading} />
        <section className="request-summary" aria-label="Request summary">
          <strong>Current request:</strong> {state.request ? `${state.request.method} ${state.request.url}` : 'Submit a URL to begin'}
        </section>
        {state.error && <p role="alert" className="error-message">{state.error}</p>}
        <div className="results-history-container">
          <History history={state.history} onSelect={(entry) => dispatch({ type: 'SELECT_HISTORY', entry })}
            onClear={() => dispatch({ type: 'CLEAR_HISTORY' })} />
          <Results response={state.response} loading={state.loading} />
        </div>
      </main>
      <Footer />
    </>
  );
}
