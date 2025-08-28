import React, { useState, useEffect } from 'react'; 
import './app.scss';

import Header from './components/header';
import Footer from './components/footer';
import Form from './components/form';
import Results from './components/results';

function App() {
  // State for request details, data, loading, and history
  const [request, setRequest] = useState({});
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // Function passed down to <Form /> that updates request state
  const callApi = (requestParams) => {
    setRequest(requestParams);
    setLoading(true);

    // Add request to history (for later use)
    setHistory((prev) => [
      ...prev,
      { method: requestParams.method, url: requestParams.url }
    ]);
  };

  // Whenever request changes, actually make the API call
  useEffect(() => {
    const fetchData = async () => {
      if (request.method && request.url) {
        try {
          const options = {
            method: request.method,
            headers: { "Content-Type": "application/json" },
          };

          // Only include body if user provided one
          if (request.body && (request.method === "POST" || request.method === "PUT")) {
            options.body = JSON.stringify(request.body);
          }

          const response = await fetch(request.url, options);
          const json = await response.json();

          setData(json);
        } catch (err) {
          setData({ error: "Something went wrong", details: err.message });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [request]);

  return (
    <React.Fragment>
      <Header />
      <div>Request Method: {request.method}</div>
      <div>URL: {request.url}</div>

      {/* Pass callApi to Form so user can submit API details */}
      <Form handleApiCall={callApi} />

      {/* Display results */}
      <Results data={data} loading={loading} history={history} />

      <Footer />
    </React.Fragment>
  );
}

export default App;
