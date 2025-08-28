// src/components/History/History.js
import React from 'react';
import '../Results/results.scss'; // reuse same SCSS for consistent style

function History({ history = [] }) { // ✅ default to empty array to avoid .length errors
  return (
    <section className="history">
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
              <span className={`method ${entry.method?.toLowerCase() || ''}`}>
                {entry.method}
              </span>
              &nbsp;→ {entry.url} {/* URL of the request */}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default History;
