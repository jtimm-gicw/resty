import React, { useState } from 'react';

import './app.scss';

import Header from './components/header';
import Footer from './components/footer';
import Form from './components/form';
import Results from './components/results';

function App() {
  // State for the current request, response data, loading, and history
  const [request, setRequest] = useState({}); // The method + URL (and maybe body if it’s POST/PUT)
  const [data, setData] = useState(null); // The API data you want to show
  const [loading, setLoading] = useState(false); // Whether you’re waiting on results
  const [history, setHistory] = useState([]);

  const callApi = (request) => {
    setRequest(request);
    setLoading(true);

    // Add the request to history
    setHistory((prev) => [
      ...prev,
      { method: request.method, url: request.url }
    ]);

    // Mock API response
    setTimeout(() => {
      const mockData = {
        count: 2,
        results: [
          { name: 'fake thing 1', url: 'http://fakethings.com/1' },
          { name: 'fake thing 2', url: 'http://fakethings.com/2' },
        ],
      };

      setData(mockData);
      setLoading(false);
    }, 1000); // simulate network delay
  };

  return (
    <React.Fragment>
      <Header />
      <div>Request Method: {request.method}</div>
      <div>URL: {request.url}</div>

      {/* Pass callApi to Form */}
      <Form handleApiCall={callApi} />

      {/* Pass history and loading state to Results */}
      <Results data={data} loading={loading} history={history} />

      <Footer />
    </React.Fragment>
  );
}

export default App;
