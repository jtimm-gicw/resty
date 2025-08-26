import React from 'react';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css'; // pre-made dark theme
import './results.scss';

function Results({ data, loading, history }) {
  return (
    <section>
      {/* =========================
           Request History
           Show a list of previous API requests
      ========================== */}
      <h2>Request History</h2>
      {history.length === 0 ? (
        <p>No requests made yet.</p> // if nothing in history
      ) : (
        <ul>
          {history.map((entry, idx) => (
            <li key={idx}>
              {/* REST method badge, styled via SCSS */}
              <span className={`method ${entry.method.toLowerCase()}`}>
                {entry.method}
              </span>
              &nbsp;→ {entry.url} {/* URL of the request */}
            </li>
          ))}
        </ul>
      )}

      {/* =========================
           Response Section
           Show Loading or JSON response
      ========================== */}
      <h2>Response</h2>

      {/* Show loading text if waiting for API */}
      {loading && <p>Loading...</p>}

      {/* Show pretty JSON if response exists and not loading */}
      {!loading && data && (
        <JSONPretty 
          id="json-pretty" 
          data={JSON.stringify(data, null, 2)} // nicely formatted JSON
        ></JSONPretty>
      )}
    </section>
  );
}

export default Results;
