import React from 'react';
import './history.scss';

// Phase 4: old API calls are interactive. Selecting one restores its saved response.
export default function History({ history, onSelect, onClear }) {
  return (
    <section className="history panel" aria-label="Request history">
      <div className="history-heading"><h2>Request History</h2>
        {history.length > 0 && <button type="button" onClick={onClear} className="clear-button">Clear</button>}
      </div>
      {history.length === 0 ? <p>No requests made yet.</p> : (
        <ol>
          {history.map((entry, index) => (
            <li key={entry.date + '-' + entry.id + '-' + index}>
              <button type="button" className="history-entry" onClick={() => onSelect(entry)}
                aria-label={`Show saved result for ${entry.method} ${entry.url}`}>
                <span className={`method-pill ${entry.method.toLowerCase()}`}>{entry.method}</span>
                <span className="history-url">{entry.url}</span>
                <span className="history-status">{entry.response?.status ?? 'Network error'}</span>
              </button>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
