import React from 'react';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css'; // built-in theme
import './results.scss';

function Results({ data }) {
  return (
    <section>
      {data ? <JSONPretty id="json-pretty" data={data}></JSONPretty> : null}
    </section>
  );
}

export default Results;
