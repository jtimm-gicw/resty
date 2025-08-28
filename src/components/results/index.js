// Results.js
import React from 'react';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css'; // pre-made dark theme
import './results.scss';
import History from './History'; // import new component

function Results({ data, loading, history }) {
  return (
    <div className="results-container">
      {/* =========================
           LEFT: History Section
      ========================== */}
      <History history={history} />

      {/* =========================
           RIGHT: Response Section
      ========================== */}
      <section className="response">
        <h2>Response</h2>

        {/* Show loading text if waiting for API */}
        {loading && <p>Loading...</p>}

        {/* Show pretty JSON if response exists and not loading */}
        {!loading && data && (
          <JSONPretty 
            id="json-pretty" 
            data={JSON.stringify(data, null, 2)} // nicely formatted JSON
          />
        )}
      </section>
    </div>
  );
}

export default Results;
