import React from 'react';
import './form.scss';

// Phase 1: reusable function component. Phase 2: controlled inputs.
// Phase 4: values live in the App reducer; dispatch changes upward.
export default function Form({ draft, dispatch, onSubmit, loading }) {
  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
  const showBody = ['POST', 'PUT', 'PATCH'].includes(draft.method);
  const submit = (event) => { event.preventDefault(); onSubmit(); };
  return (
    <form className="request-form" onSubmit={submit} aria-label="API request form">
      <label htmlFor="api-url">API URL</label>
      <div className="url-row">
        <input id="api-url" type="url" required placeholder="https://jsonplaceholder.typicode.com/users/1"
          value={draft.url} onChange={(e) => dispatch({ type: 'EDIT_URL', value: e.target.value })} />
        <button type="submit" className="go-button" disabled={loading}>{loading ? 'Loading…' : 'GO!'}</button>
      </div>
      <div className="method-group" role="group" aria-label="HTTP method">
        {methods.map((method) => (
          <button key={method} type="button" aria-pressed={draft.method === method}
            className={draft.method === method ? 'method-button active' : 'method-button'}
            onClick={() => dispatch({ type: 'EDIT_METHOD', value: method })}>{method}</button>
        ))}
      </div>
      {showBody && (
        <>
          <label htmlFor="request-body">JSON request body</label>
          <textarea id="request-body" rows="5" spellCheck="false"
            placeholder={'{"title":"My Post","body":"Example","userId":1}'}
            value={draft.body} onChange={(e) => dispatch({ type: 'EDIT_BODY', value: e.target.value })} />
        </>
      )}
    </form>
  );
}
