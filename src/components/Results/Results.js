import React from 'react';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';
import './results.scss';

// Render HTTP metadata, headers and complete response body separately.
export default function Results({ response, loading }) {
  return (
    <section className="results panel" aria-label="API response">
      <h2>Response</h2>
      {loading && <p role="status">Loading...</p>}
      {!loading && !response && <p>No data to display. Submit a request or select history.</p>}
      {!loading && response && (
        <>
          <p className={response.ok ? 'status-ok' : 'status-error'}>
            HTTP {response.status === null ? 'Network Error' : response.status} {response.statusText}
          </p>
          <h3>Response Headers</h3>
          <JSONPretty id="response-headers" data={response.headers} />
          <h3>Response Body</h3>
          <JSONPretty id="json-pretty" data={response.data === null ? null : response.data} />
        </>
      )}
    </section>
  );
}
