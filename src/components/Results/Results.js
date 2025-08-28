// Results.js
import React from 'react';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css'; // pre-made dark theme
import './results.scss';

function Results({ data, loading }) {
  return (
    <section className="results">
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
        />
      )}

      {/* Show message if no data */}
      {!loading && !data && <p>No data to display.</p>}
    </section>
  );
}

export default Results;
